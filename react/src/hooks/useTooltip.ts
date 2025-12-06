import { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash-es/debounce';

const useTooltip = (delay = 250) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    // Store stable debounced function in a ref
    const debouncedShowRef = useRef<
        ReturnType<typeof debounce> | null
    >(null);

    // Create debouncing once
    if (!debouncedShowRef.current) {
        debouncedShowRef.current = debounce(
            () => setIsTooltipVisible(true),
            delay
        );
    }

    const displayTooltip = useCallback(() => {
        debouncedShowRef.current!.cancel();
        debouncedShowRef.current!.call(undefined);
    }, []);

    const removeTooltip = useCallback(() => {
        debouncedShowRef.current!.cancel();
        setIsTooltipVisible(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            debouncedShowRef.current?.cancel();
        };
    }, []);

    return { isTooltipVisible, displayTooltip, removeTooltip };
};

export default useTooltip;
