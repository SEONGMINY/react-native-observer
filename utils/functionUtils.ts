export const invokeSequentially = (...funcs: Array<((...args: unknown[]) => void) | null | undefined>): ((...args: unknown[]) => void) => {
    return (...args: unknown[]) => {
        funcs.forEach((func) => {
            try {
                func?.(...args);
            } catch (error) {
                console.error("[Observer] Error running function sequentially:", error);
            }
        });
    };
};
