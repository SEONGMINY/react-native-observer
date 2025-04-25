import {DependencyList, useContext, useEffect, useRef} from "react";
import {ItemContext, ObserverControlContext} from "@/components/ObserverProvider";

const useInView = (
    onVisible: () => void | (() => void),
    deps: DependencyList = [],
) => {
    const { itemKey } = useContext(ItemContext);
    const observerControl = useContext(ObserverControlContext);

    const cleanupRef = useRef<(() => void) | void>();

    useEffect(() => {
        if (!observerControl || !itemKey) return;

        const listener = () => {
            const cleanup = onVisible();
            return cleanup;
        };

        observerControl.addListener(itemKey, listener);

        return () => {
            observerControl.removeListener(itemKey, listener);
        };
    }, [itemKey, observerControl, onVisible]);
}

export default useInView
