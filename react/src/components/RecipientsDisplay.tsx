import {
    FC,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import styled from "styled-components";
import { debounce } from "lodash-es";

import RecipientsBadge from "./RecipientsBadge";
import RecipientsTooltip from "./RecipientsTooltip";
import useTooltip from "../hooks/useTooltip";

// --------------------------------------
// Styled Components
// --------------------------------------
const RecipientLayout = styled.span`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

// --------------------------------------
// Constants
// --------------------------------------
const EMAIL_SEPARATOR = ", ";
const MORE_INDICATOR = "...";
const TRUNCATION_DELAY_IN_MS = 150;

// --------------------------------------
// Helpers
// --------------------------------------
const concatenateEmails = (emails: string[]): string =>
    emails.join(EMAIL_SEPARATOR);

const formatRecipients = (recipients: string[], truncCount: number): string => {
    const shouldTruncate = truncCount > 0 && recipients.length > truncCount;

    const visible = shouldTruncate
        ? recipients.slice(0, recipients.length - truncCount)
        : recipients;

    return (
        concatenateEmails(visible) +
        (shouldTruncate ? EMAIL_SEPARATOR + MORE_INDICATOR : "")
    );
};

type Widths = {
    cellWidth: number;
    recipientWidth: number;
    badgeWidth: number;
};

const exceedsWidth = (w: Widths, visibleCount: number) =>
    w.recipientWidth + w.badgeWidth > w.cellWidth && visibleCount > 1;

const canUntruncate = (
    currentWidth: number,
    lastWidth: number,
    truncatedCount: number
) => currentWidth > lastWidth && truncatedCount > 0;

// --------------------------------------
// Component
// --------------------------------------
interface RecipientsDisplayProps {
    recipients: string[];
}

const RecipientsDisplay: FC<RecipientsDisplayProps> = ({
                                                           recipients,
                                                       }): ReactElement => {
    const [numTruncated, setNumTruncated] = useState(0);
    const [lastWidth, setLastWidth] = useState(0);

    const { isTooltipVisible, displayTooltip, removeTooltip } = useTooltip();

    const cellRef = useRef<HTMLDivElement>(null);
    const namesRef = useRef<HTMLSpanElement>(null);
    const badgeRef = useRef<HTMLSpanElement>(null);

    const visibleCount = recipients.length - numTruncated;

    const formatted = useMemo(
        () => formatRecipients(recipients, numTruncated),
        [recipients, numTruncated]
    );

    const handleTruncation = useCallback(
        (w: Widths) => {
            if (exceedsWidth(w, visibleCount)) {
                setNumTruncated((prev) => prev + 1);
                setLastWidth(w.cellWidth);
            } else if (canUntruncate(w.cellWidth, lastWidth, numTruncated)) {
                setNumTruncated((prev) => Math.max(prev - 1, 0));
            }
        },
        [visibleCount, lastWidth, numTruncated]
    );

    const firstRender = useRef(true);

    useEffect(() => {
        const delay = firstRender.current ? 0 : TRUNCATION_DELAY_IN_MS;

        const handleResize = debounce(() => {
            if (!cellRef.current || !namesRef.current) return;

            const widths: Widths = {
                cellWidth: cellRef.current.offsetWidth,
                recipientWidth: namesRef.current.offsetWidth,
                badgeWidth: badgeRef.current?.offsetWidth ?? 0,
            };

            handleTruncation(widths);
        }, delay);

        window.addEventListener("resize", handleResize);
        handleResize(); // execute immediately on mount

        firstRender.current = false;

        return () => window.removeEventListener("resize", handleResize);
    }, [formatted, handleTruncation]);

    return (
        <div ref={cellRef}>
            <RecipientLayout>
        <span
            ref={namesRef}
            style={
                visibleCount === 1
                    ? {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }
                    : {}
            }
        >
          {formatted}&ensp;
        </span>

                {numTruncated > 0 && (
                    <span
                        ref={badgeRef}
                        onMouseEnter={displayTooltip}
                        onMouseLeave={removeTooltip}
                        style={{ cursor: "help" }}
                    >
            <RecipientsBadge numTruncated={numTruncated} />
          </span>
                )}
            </RecipientLayout>

            <RecipientsTooltip isVisible={isTooltipVisible} onHide={removeTooltip}>
                {concatenateEmails(recipients)}
            </RecipientsTooltip>
        </div>
    );
};

export default RecipientsDisplay;
