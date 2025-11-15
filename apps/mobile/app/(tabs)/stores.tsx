import { View, Text } from "react-native";

export default function StoreLocator() {
  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-lg font-semibold mb-1">Nearby Stores</Text>
      <Text className="text-gray-500 mb-4">
        Find supermarkets near you (coming soon)
      </Text>
    </View>
  );
}
