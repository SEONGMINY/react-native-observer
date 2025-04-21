import { useRef } from "react";

type ObserverCleanup = () => void;
type ObserverVisibleListener<Args extends any[] = []> = (
  ...args: Args
) => ObserverCleanup | undefined | void;

const useObserver = <
  K = string,
  L extends ObserverVisibleListener = ObserverVisibleListener,
>() => {
  const visibleListenersMap = useRef<Map<K, Set<L>>>(new Map());
  const invisibleCleanupMap = useRef<
    Map<K, Map<L, ObserverCleanup | undefined | void>>
  >(new Map());

  const addListener = (key: K, listener: L) => {
    registerListenerForKey(visibleListenersMap.current, key, listener);
    unregisterCleanupForKey(invisibleCleanupMap.current, key, listener);
  };

  const removeListener = (key: K, listener: L) => {
    unregisterListenerForKey(visibleListenersMap.current, key, listener);
    unregisterCleanupForKey(invisibleCleanupMap.current, key, listener);
  };

  const notifyListeners = (key: K, ...args: Parameters<L>) => {
    const listeners = visibleListenersMap.current.get(key);
    if (listeners && listeners.size > 0) {
      const listenersToNotify = new Set(listeners);
      visibleListenersMap.current.delete(key);

      listenersToNotify.forEach((listener) => {
        try {
          const cleanup = listener.apply(null, args);

          if (typeof cleanup === "function") {
            registerCleanupForKey(
              invisibleCleanupMap.current,
              key,
              listener,
              cleanup,
            );
          }
        } catch (error) {
          console.error(
            `[ObserverMap] Error notifying listener for key "${String(key)}":`,
            error,
          );
        }
      });
    }
  };

  return {
    addListener,
    removeListener,
    notifyListeners,
  }
};

export default useObserver;
