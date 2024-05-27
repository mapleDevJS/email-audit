import {FC, ReactNode} from "react";
import {createPortal} from "react-dom";
import styled from 'styled-components';

interface RecipientsTooltipProps {
    isVisible: boolean;
    onHide: () => void;
    children: ReactNode;
}

const TooltipContainer = styled.div`
    display: flex;
    align-items: center;
    position: fixed;
    top: 8px;
    right: 8px;
    margin-top: 8px;
    margin-right: 8px;
    padding: 8px 16px;
    background-color: #666;
    color: #f0f0f0;
    border-radius: 24px;
`;

const CONTAINER: Element | DocumentFragment = document.body;

const RecipientsTooltip: FC<RecipientsTooltipProps> = ({children, isVisible, onHide}) => {
    if (!isVisible) {
        return null;
    }
    return createPortal(
        <TooltipContainer onClick={onHide}>
            {children}
        </TooltipContainer>,
        CONTAINER
    );
}

export default RecipientsTooltip;