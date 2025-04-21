const registerListenerForKey = <K, Listener>(
  map: Map<K, Set<Listener>>,
  key: K,
  listener: Listener,
): void => {
  if (!map.has(key)) {
    map.set(key, new Set<Listener>());
  }
  map.get(key)!.add(listener);
};

const unregisterListenerForKey = <K, Listener>(
  map: Map<K, Set<Listener>>,
  key: K,
  listener: Listener,
): void => {
  const listenerSet = map.get(key);
  if (listenerSet) {
    listenerSet.delete(listener);
    if (listenerSet.size === 0) {
      map.delete(key);
    }
  }
};

const registerCleanupForKey = <K, Listener, Cleanup>(
  map: Map<K, Map<Listener, Cleanup>>,
  key: K,
  listener: Listener,
  cleanup: Cleanup,
): void => {
  if (!map.has(key)) {
    map.set(key, new Map<Listener, Cleanup>());
  }
  map.get(key)!.set(listener, cleanup);
};

const unregisterCleanupForKey = <K, Listener, Cleanup>(
  map: Map<K, Map<Listener, Cleanup>>,
  key: K,
  listener: Listener,
): void => {
  const cleanupMap = map.get(key);
  if (cleanupMap) {
    cleanupMap.delete(listener);
    if (cleanupMap.size === 0) {
      map.delete(key);
    }
  }
};
