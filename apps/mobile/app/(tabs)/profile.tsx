import { View, Text } from "react-native";
import { useAppStore } from "../../src/store";

export default function ProfileSettings() {
  const { prefs } = useAppStore();
  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-lg font-semibold mb-2">Profile</Text>
      <Text className="text-gray-500 mb-4">
        Basic placeholder – later we connect Cognito.
      </Text>
      <Text className="font-semibold mb-1">Goal</Text>
      <Text className="text-gray-700 mb-3">
        {prefs.goal ?? "Not set"}
      </Text>
      <Text className="font-semibold mb-1">Cuisines</Text>
      <Text className="text-gray-700 mb-3">
        {prefs.cuisines.join(", ") || "None"}
      </Text>
      <Text className="font-semibold mb-1">Allergies</Text>
      <Text className="text-gray-700">
        {prefs.allergies.join(", ") || "None"}
      </Text>
    </View>
  );
}
