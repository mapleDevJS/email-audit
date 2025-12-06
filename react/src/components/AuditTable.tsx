import { useMemo, type HTMLAttributes } from 'react';
import styled from 'styled-components';
import { groupBy } from 'lodash-es';
import type { Email } from '../types/Email';
import RecipientsDisplay from './RecipientsDisplay';
import DateDisplay from './DateDisplay';
import TimeDisplay from './TimeDisplay';

type AuditTableProps = {
    emails: Email[];
} & HTMLAttributes<HTMLTableElement>;

function AuditTable({ emails, ...rest }: AuditTableProps) {
    // Stable, timezone-safe date grouping (YYYY-MM-DD)
    const emailsByDate = useMemo(() => {
        return groupBy(emails, ({ datetime }) => datetime.split('T')[0]);
    }, [emails]);

    return (
        <>
            <table {...rest}>
                <thead>
                <tr>
                    <th className="col-sender">Sender</th>
                    <th className="col-recipients">Recipients</th>
                    <th className="col-subject">Subject</th>
                    <th className="col-date align-right">Date</th>
                    <th className="col-time align-right">Time</th>
                </tr>
                </thead>

                {Object.entries(emailsByDate).map(([dayKey, emailGroup]) => (
                    <tbody key={dayKey}>
                    {/* Group Header Row */}
                    <tr className="group-header">
                        <td colSpan={5}>{new Date(dayKey).toLocaleDateString()}</td>
                    </tr>

                    {emailGroup.map(({ id, from, to, subject, datetime }) => (
                        <tr key={id}>
                            <td>{from}</td>
                            <td>
                                <RecipientsDisplay recipients={to} />
                            </td>
                            <td>{subject}</td>
                            <td className="align-right">
                                <DateDisplay datetime={datetime} />
                            </td>
                            <td className="align-right">
                                <TimeDisplay datetime={datetime} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                ))}
            </table>
        </>
    );
}

export default styled(AuditTable)`
    table-layout: fixed;
    border: var(--border-style);
    border-spacing: 0;
    width: 100%;
    text-align: left;
    border-collapse: collapse;

    th,
    td {
        border: var(--border-style);
        padding: 5px 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 34px;
        box-sizing: border-box;
    }

    /* Header column width definitions (robust, no nth-child hazards) */
    .col-sender {
        width: 20%;
    }
    .col-recipients {
        width: 30%;
    }
    .col-subject {
        width: 50%;
    }
    .col-date {
        width: 90px;
    }
    .col-time {
        width: 70px;
    }

    /* A much more correct and reliable striping */
    tbody:nth-of-type(even) {
        background-color: #f2f2f2;
    }

    .align-right {
        text-align: right;
    }

    /* Date group header styling */
    .group-header td {
        font-weight: bold;
        background-color: #e8e8e8;
    }
`;
