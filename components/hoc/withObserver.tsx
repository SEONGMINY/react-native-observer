import {
  ItemContext,
  ObserverControlContext,
} from "@/components/ObserverProvider";
import useObserver from "@/hooks/useObserver";
import { invokeSequentially } from "@/utils/functionUtils";
import {
  ComponentType,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useCallback,
  useRef,
} from "react";
import type {
  ListRenderItemInfo,
  ViewToken,
  VirtualizedListProps,
} from "react-native";

type BaseListProps<ItemType> = Pick<
  VirtualizedListProps<ItemType>,
  "data" | "renderItem" | "keyExtractor" | "onViewableItemsChanged"
>;

type ObserverEnableProps = {
  $enable?: boolean;
};

type WithObserverProps<
  Props extends BaseListProps<unknown>,
  ItemType = unknown,
  RefType = unknown
> = Omit<Props, keyof BaseListProps<ItemType>> &
  BaseListProps<ItemType> &
  ObserverEnableProps &
  RefAttributes<RefType>;

export const withObserver = <
  Props extends BaseListProps<unknown>,
  ItemType = unknown,
  RefType = unknown
>(
  Component: ComponentType<Props>
): ForwardRefExoticComponent<
  PropsWithoutRef<WithObserverProps<Props, ItemType, RefType>> &
    RefAttributes<RefType>
> => {
  return forwardRef<RefType, WithObserverProps<Props, ItemType, RefType>>(
    (props, ref) => {
      const {
        onViewableItemsChanged: originalOnViewableItemsChanged,
        keyExtractor,
        renderItem,
        data,
        $enable = true,
        ...restProps
      } = props;

      const observerMap =
        useObserver<ReturnType<NonNullable<typeof keyExtractor>>>();
      const viewableKeysRef = useRef<
        Set<ReturnType<NonNullable<typeof keyExtractor>>>
      >(new Set());

      const handleViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
          if (!$enable || !keyExtractor) return;

          const currentVisibleKeys = new Set<ReturnType<typeof keyExtractor>>();
          const previouslyVisibleKeys = new Set(viewableKeysRef.current);

          viewableItems.forEach(({ index, item, isViewable }) => {
            if (isViewable && item != null) {
              const key = keyExtractor(item as ItemType, index ?? -1);
              currentVisibleKeys.add(key);
              previouslyVisibleKeys.delete(key);
            }
          });

          currentVisibleKeys.forEach((key) => {
            if (!viewableKeysRef.current.has(key)) {
              observerMap.notifyListeners(key);
            }
          });

          previouslyVisibleKeys.forEach((key) => {
            observerMap.cleanupListeners(key);
          });

          viewableKeysRef.current = currentVisibleKeys;
        },
        [$enable, keyExtractor, observerMap]
      );

      const combinedOnViewableItemsChanged = invokeSequentially(
        handleViewableItemsChanged,
        originalOnViewableItemsChanged
      );

      const componentProps = {
        ...(restProps as Omit<Props, keyof BaseListProps<ItemType>>),
        data,
        keyExtractor,
        renderItem,
        onViewableItemsChanged: combinedOnViewableItemsChanged,
      } as Props;

      return (
        <ObserverControlContext.Provider value={observerMap}>
          <Component
            ref={ref}
            {...componentProps}
            renderItem={(info) => {
              if (!keyExtractor || !renderItem) {
                console.error(
                  "[withObserve] keyExtractor 또는 renderItem이 정의되지 않았습니다."
                );
                return null;
              }

              const typedInfo = info as ListRenderItemInfo<ItemType>;
              const itemKey = keyExtractor(typedInfo.item, typedInfo.index);

              return (
                <ItemContext.Provider value={{ itemKey }}>
                  {renderItem(typedInfo)}
                </ItemContext.Provider>
              );
            }}
          />
        </ObserverControlContext.Provider>
      );
    }
  );
};
