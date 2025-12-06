import styled from 'styled-components'
import type { ComponentPropsWithoutRef } from 'react'

export type RecipientsBadgeProps = {
  numTruncated: number
} & Omit<ComponentPropsWithoutRef<'span'>, 'className' | 'style'>

function RecipientsBadge({ numTruncated = 0, ...rest }: RecipientsBadgeProps) {
    return (
        <span
            {...rest}
            data-testid="badge"
            role="status"
            aria-label={`+${numTruncated} more recipient${numTruncated !== 1 ? "s" : ""}`}
        >
      +{numTruncated}
    </span>
    );
}

export default styled(RecipientsBadge)`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 5px;
    border-radius: 3px;
    background-color: var(--color-primary);
    color: var(--color-on-primary, #f0f0f0);
    font-size: 0.875rem;
    overflow: hidden;
    white-space: nowrap;
`;
