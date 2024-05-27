import {FC, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from "react";
import RecipientsBadge from "./RecipientsBadge.tsx";
import {debounce} from 'lodash-es';
import styled from 'styled-components';
import RecipientsTooltip from "./RecipientsTooltip.tsx";
import useTooltip from "../hooks/useTooltip.ts";
import {Recipient} from "../types/Recipient";

const RecipientLayout = styled.span`
    display: flex;
    justify-content: space-between;
`;

interface RecipientsDisplayProps {
    recipients: Recipient[];
}

const EMAIL_SEPARATOR = ', '
const MORE_INDICATOR = '...';
const TRUNCATION_DELAY_IN_MS = 150;

const concatenateNames = (recipients: Recipient[]): string => (recipients.join(EMAIL_SEPARATOR));

const formatRecipients = (recipients: Recipient[], truncationCount: number): string => {
    const needTruncate = truncationCount > 0 && recipients.length > truncationCount;
    const recipientsList = needTruncate ? recipients.slice(0, recipients.length - truncationCount) : recipients;
    return concatenateNames(recipientsList) + (needTruncate ? EMAIL_SEPARATOR + MORE_INDICATOR : '');
};

// const hasExceededCellWidth = (cellWidth: number, recipientWidth: number, badgeWidth: number, numVisible: number): boolean =>
//     recipientWidth + badgeWidth > cellWidth && numVisible > 1;

type Widths = {
    cellWidth: number,
    recipientWidth: number,
    badgeWidth: number
}
const hasExceededCellWidth = ({recipientWidth, badgeWidth, cellWidth}: Widths, numVisible: number): boolean =>
    recipientWidth + badgeWidth > cellWidth && numVisible > 1;

const hasDecreasedCellWidth = (cellWidth: number, lastWidth: number, numTruncated: number): boolean =>
    cellWidth > lastWidth && numTruncated >= 1;


const RecipientsDisplay: FC<RecipientsDisplayProps> = ({recipients}): ReactElement => {
    const [numTruncatedRecipients, setNumTruncatedRecipients] = useState<number>(0);
    const [lastKnownCellWidth, setLastKnownCellWidth] = useState<number>(0);

    const {isTooltipVisible, displayTooltip, removeTooltip} = useTooltip();

    const cellRef = useRef<HTMLDivElement | null>(null);
    const recipientRef = useRef<HTMLSpanElement | null>(null);
    const badgeRef = useRef<HTMLSpanElement | null>(null);

    const formattedRecipients = useMemo(() => formatRecipients(recipients, numTruncatedRecipients), [recipients, numTruncatedRecipients]);
    const numVisibleRecipients = recipients.length - numTruncatedRecipients;

    const handleTruncation = useCallback((
        widths: Widths
    ) => {
        if (hasExceededCellWidth(widths, numVisibleRecipients)) {
            setNumTruncatedRecipients((prev) => prev + 1);
            setLastKnownCellWidth(widths.cellWidth);
        } else if (hasDecreasedCellWidth(widths.cellWidth, lastKnownCellWidth, numTruncatedRecipients)) {
            setNumTruncatedRecipients((prev) => prev - 1);
        }
    }, [lastKnownCellWidth, numTruncatedRecipients, numVisibleRecipients]);

    const isFirstRender = useRef(true);

    useEffect(() => {
        const delay = isFirstRender.current ? 0 : TRUNCATION_DELAY_IN_MS;

        const handleResize = debounce(() => {
            if (cellRef.current && recipientRef.current) {
                const sizes = {
                    cellWidth: cellRef.current.offsetWidth,
                    recipientWidth: recipientRef.current.offsetWidth,
                    badgeWidth: badgeRef.current?.offsetWidth || 0
                }

                handleTruncation(sizes);
            }
        }, delay);

        window.addEventListener("resize", handleResize);
        handleResize();

        isFirstRender.current = false;

        return () => window.removeEventListener("resize", handleResize);
    }, [formattedRecipients, handleTruncation]);

    return (
        <div ref={cellRef}>
            <RecipientLayout>
                <span ref={recipientRef} style={numVisibleRecipients === 1 ? {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                } : {}}>
                    {formattedRecipients}&ensp;
                </span>
                {numTruncatedRecipients > 0 &&
                    <span ref={badgeRef} onMouseEnter={displayTooltip} onMouseLeave={removeTooltip}
                          style={{cursor: "help"}}>
                        <RecipientsBadge numTruncated={numTruncatedRecipients}/>
                    </span>
                }
            </RecipientLayout>
            <RecipientsTooltip isVisible={isTooltipVisible} onHide={removeTooltip}>
                {concatenateNames(recipients)}
            </RecipientsTooltip>
        </div>
    );
};

export default RecipientsDisplay;