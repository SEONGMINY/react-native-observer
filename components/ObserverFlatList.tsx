import { FlatList, FlatListProps } from "react-native";
import { withObserver } from "@/components/hoc/withObserver";
import { ReactElement } from "react";

const ObservedFlatList = withObserver(FlatList) as <ItemType>(
  props: FlatListProps<ItemType> & { $enable?: boolean } & React.RefAttributes<
      FlatList<ItemType>
    >
) => ReactElement;

export default ObservedFlatList;
