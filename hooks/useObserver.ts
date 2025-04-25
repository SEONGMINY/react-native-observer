import { useRef } from "react";
import {
  registerCleanupForKey,
  registerListenerForKey,
  unregisterCleanupForKey,
  unregisterListenerForKey
} from "@/utils/mapUtils";

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

  const cleanupListeners = (key: K) => {
    const cleanups = invisibleCleanupMap.current.get(key);
    if (cleanups && cleanups.size > 0) {
      const cleanupsToRun = new Map(cleanups);
      invisibleCleanupMap.current.delete(key);

      cleanupsToRun.forEach((cleanup, listener) => {
        try {
          if (typeof cleanup === 'function') {
            cleanup();
          }
        } catch (error) {
          console.error(`[ObserverMap] Error cleaning up listener for key "${String(key)}":`, error);
        } finally {
          registerListenerForKey(visibleListenersMap.current, key, listener); // 이름 변경 적용
        }
      });
    }
  };

  return {
    addListener,
    removeListener,
    notifyListeners,
    cleanupListeners,
  }
};

export default useObserver;
