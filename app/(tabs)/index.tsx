import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import ObservedFlatList from "@/components/ObserverFlatList";
import useInView from "@/hooks/useInView";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  const items = new Array(50).fill(null).map((_, index) => ({
    id: (index + 1).toString(),
    title: `Item ${index + 1}`,
  }));

  return (
    <SafeAreaView>
      <ObservedFlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item id={item.id} title={item.title} />}
      />
    </SafeAreaView>
  );
}

const Item = ({ id, title }: { id: string; title: string }) => {
  useInView(() => {
    console.log(`${id}가 화면에 나타났어요!`);

    return () => {
      console.log(`${id}가 화면에서 사라졌어요.`);
    };
  }, [id]);

  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
