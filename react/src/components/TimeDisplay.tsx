import { FC, useMemo } from "react";

export interface TimeDisplayProps {
    datetime: string;
}

const OPTIONS: Intl.DateTimeFormatOptions = Object.freeze({
    hour: "2-digit",
    minute: "2-digit",
});

const TimeDisplay: FC<TimeDisplayProps> = ({ datetime }) => {
    const formattedTime = useMemo(() => {
        const dateObj = new Date(datetime);

        if (isNaN(dateObj.getTime())) {
            return "--:--"; // fallback for invalid datetime
        }

        return dateObj.toLocaleTimeString("en-US-u-hc-h23", OPTIONS);
    }, [datetime]);

    return <span aria-label={`Time: ${formattedTime}`}>{formattedTime}</span>;
};

export default TimeDisplay;
