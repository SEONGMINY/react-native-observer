import React, { createContext } from "react";

export const ItemContext = React.createContext<{ itemKey: string | null }>({
  itemKey: null,
});

export type ObserverContextType<K = string> = {
  addListener: (key: K, listener: () => void) => void;
  removeListener: (key: K, listener: () => void) => void;
  notifyListeners: (key: K) => void;
  cleanupListeners: (key: K) => void;
};

export const ObserverControlContext = createContext<ObserverContextType | null>(
  null
);
