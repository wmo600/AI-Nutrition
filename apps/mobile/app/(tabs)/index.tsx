import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "../../src/store";

export default function HomeDashboard() {
  const router = useRouter();
  const { prefs } = useAppStore();

  return (
    <ScrollView className="flex-1 bg-gray-50 px-5 pt-10">
      {/* Goal card */}
      <Text className="text-xs text-gray-400 mb-1">Your Goal</Text>
      <View className="bg-white rounded-2xl px-4 py-3 mb-6 shadow-sm flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-green-600 text-sm font-semibold">
            {prefs.goal ?? "Set your goal"}
          </Text>
          <Text className="text-gray-500 text-xs mt-0.5">
            Personalized planning
          </Text>
        </View>

        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
          onPress={() => router.push("/profile")}
        >
          <Text className="text-lg">👤</Text>
        </TouchableOpacity>
      </View>

      {/* Tiles */}
      <View className="flex-row flex-wrap -mx-1 mb-8">
        <DashboardTile
          icon="🛒"
          title="Plan Groceries"
          subtitle="Plan by meal types"
          onPress={() => router.push("/(tabs)/planner")}
        />
        <DashboardTile
          icon="✨"
          title="AI Recs"
          subtitle="Smart grocery suggestions"
          onPress={() => router.push("/planner-recommendations")}
        />
        <DashboardTile
          icon="📍"
          title="Find Stores"
          subtitle="Nearby supermarkets"
          onPress={() => router.push("/(tabs)/stores")}
        />
        <DashboardTile
          icon="📝"
          title="My Lists"
          subtitle="Active & saved lists"
          onPress={() => router.push("/(tabs)/lists")}
        />
      </View>

      {/* Weekly deals */}
      <Text className="text-sm font-semibold mb-2">Weekly Deals</Text>

      <View className="bg-green-50 rounded-2xl px-4 py-3 mb-3">
        <Text className="text-sm font-medium">20% off vegetables</Text>
        <Text className="text-xs text-gray-500 mt-0.5">FairPrice</Text>
      </View>

      <View className="bg-blue-50 rounded-2xl px-4 py-3 mb-3">
        <Text className="text-sm font-medium">Buy 2 Get 1 Free Yogurt</Text>
        <Text className="text-xs text-gray-500 mt-0.5">Cold Storage</Text>
      </View>

      <View className="h-6" />
    </ScrollView>
  );
}

type TileProps = {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
};

function DashboardTile({ icon, title, subtitle, onPress }: TileProps) {
  return (
    <TouchableOpacity
      className="w-1/2 px-1 mb-3"
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View className="bg-white rounded-2xl px-4 py-4 shadow-sm h-full">
        <Text className="text-2xl mb-1">{icon}</Text>
        <Text className="font-semibold text-sm mb-0.5">{title}</Text>
        <Text className="text-gray-500 text-xs">{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}
