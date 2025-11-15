import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "../../src/store";

export default function HomeDashboard() {
  const router = useRouter();
  const { prefs } = useAppStore();

  return (
    <View className="flex-1 bg-gray-50 px-6 pt-12">
      <Text className="text-xs text-gray-400 mb-1">Your Goal</Text>
      <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm flex-row justify-between items-center">
        <View>
          <Text className="text-green-600 text-sm">
            {prefs.goal ?? "Set your goal"}
          </Text>
          <Text className="text-gray-500 text-xs">Personalized planning</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Text className="text-gray-400 text-2xl">👤</Text>
        </TouchableOpacity>
      </View>

      {/* Tiles */}
      <View className="grid grid-cols-2 gap-3 mb-8">
        <TouchableOpacity
          className="bg-white rounded-2xl p-4 shadow-sm"
          onPress={() => router.push("/(tabs)/planner")}
        >
          <Text className="text-2xl mb-2">🛒</Text>
          <Text className="font-semibold mb-1">Plan Groceries</Text>
          <Text className="text-gray-500 text-xs">
            Plan by meal types
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-2xl p-4 shadow-sm"
          onPress={() => router.push("/planner-recommendations")}
        >
          <Text className="text-2xl mb-2">✨</Text>
          <Text className="font-semibold mb-1">AI Recs</Text>
          <Text className="text-gray-500 text-xs">
            Smart grocery suggestions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-2xl p-4 shadow-sm"
          onPress={() => router.push("/(tabs)/stores")}
        >
          <Text className="text-2xl mb-2">📍</Text>
          <Text className="font-semibold mb-1">Find Stores</Text>
          <Text className="text-gray-500 text-xs">
            Nearby supermarkets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-2xl p-4 shadow-sm"
          onPress={() => router.push("/(tabs)/lists")}
        >
          <Text className="text-2xl mb-2">📝</Text>
          <Text className="font-semibold mb-1">My Lists</Text>
          <Text className="text-gray-500 text-xs">
            Active & saved lists
          </Text>
        </TouchableOpacity>
      </View>

      {/* Simple “Weekly deals” placeholders */}
      <Text className="text-sm font-semibold mb-2">Weekly Deals</Text>
      <View className="bg-green-50 rounded-2xl p-3 mb-3">
        <Text className="text-sm font-medium">20% off vegetables</Text>
        <Text className="text-xs text-gray-500">FairPrice</Text>
      </View>
      <View className="bg-blue-50 rounded-2xl p-3">
        <Text className="text-sm font-medium">
          Buy 2 Get 1 Free Yogurt
        </Text>
        <Text className="text-xs text-gray-500">Cold Storage</Text>
      </View>
    </View>
  );
}
