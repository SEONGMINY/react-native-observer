export const invokeSequentially = <Args extends unknown[]>(
    ...funcs: Array<((...args: Args) => void) | null | undefined>
): ((...args: Args) => void) => {
    return (...args: Args) => {
        funcs.forEach((func) => {
            try {
                func?.(...args);
            } catch (error) {
                console.error("[invokeSequentially] Error running function:", error);
            }
        });
    };
};
