import { FC, useMemo } from "react";

export interface DateDisplayProps {
    datetime: string;
}

const DateDisplay: FC<DateDisplayProps> = ({ datetime }) => {
    const formattedDate = useMemo(() => {
        const dateObj = new Date(datetime);

        // Validate date
        if (isNaN(dateObj.getTime())) {
            return "Invalid Date";
        }

        const today = new Date();
        const isCurrentYear = dateObj.getFullYear() === today.getFullYear();

        const options: Intl.DateTimeFormatOptions = {
            year: isCurrentYear ? undefined : "2-digit",
            month: "2-digit",
            day: "2-digit",
        };

        return dateObj.toLocaleDateString("en-US", options);
    }, [datetime]);

    return <span>{formattedDate}</span>;
};

export default DateDisplay;
