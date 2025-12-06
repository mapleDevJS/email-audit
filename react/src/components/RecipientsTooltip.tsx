import { FC, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

interface RecipientsTooltipProps {
    isVisible: boolean;
    onHide: () => void;
    children: ReactNode;
}

const TooltipContainer = styled.div`
    display: inline-flex;
    align-items: center;
    position: fixed;
    top: 8px;
    right: 8px;
    padding: 8px 16px;
    background-color: #666;
    color: #f0f0f0;
    border-radius: 24px;
    z-index: 1000;
    pointer-events: auto;
`;

const RecipientsTooltip: FC<RecipientsTooltipProps> = ({
                                                           children,
                                                           isVisible,
                                                           onHide,
                                                       }) => {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    // Ensure document.body exists (SSR safe)
    useEffect(() => {
        setContainer(document.body);
    }, []);

    if (!isVisible || !container) return null;

    return createPortal(
        <TooltipContainer
            role="tooltip"
            aria-hidden={!isVisible}
            onClick={onHide}
        >
            {children}
        </TooltipContainer>,
        container
    );
};

export default RecipientsTooltip;
