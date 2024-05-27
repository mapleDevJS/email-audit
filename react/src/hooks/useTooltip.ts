import {useState, useCallback, useEffect} from 'react';
import debounce from 'lodash-es/debounce';

const DELAY_BEFORE_TOOLTIP_VISIBLE_MS = 250;

const useTooltip = () => {
    const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
    const displayTooltip
        = useCallback(debounce(() => setIsTooltipVisible(true), DELAY_BEFORE_TOOLTIP_VISIBLE_MS), []);
    const removeTooltip = useCallback(() => {
        displayTooltip.cancel();
        if (isTooltipVisible) {
            setIsTooltipVisible(false);
        }
    }, [displayTooltip, isTooltipVisible]);
    useEffect(() => {
        return () => {
            // clean up on unmount
            displayTooltip.cancel();
        };
    }, [displayTooltip]);
    return {isTooltipVisible, displayTooltip, removeTooltip};
}
export default useTooltip;