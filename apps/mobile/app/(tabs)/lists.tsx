import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useAppStore } from "../../src/store";

export default function ShoppingList() {
  const { groceryList, removeItem } = useAppStore();

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-lg font-semibold mb-4">Shopping List</Text>

      <FlatList
        data={groceryList}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text className="text-gray-500">
            No items yet. Plans will appear here.
          </Text>
        }
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center border-b border-gray-100 py-3">
            <View>
              <Text className="font-medium">{item.name}</Text>
              <Text className="text-gray-500 text-xs">
                {item.quantity}
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Text className="text-red-500 text-sm">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
