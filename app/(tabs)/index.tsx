import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  const items = new Array(50).fill(null).map((_, index) => `Item ${index + 1}`);

  return (
    <SafeAreaView>
      <FlatList data={items} renderItem={({ item }) => <Item title={item} />} />
    </SafeAreaView>
  );
}

const Item = ({ title }: { title: string }) => {
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
