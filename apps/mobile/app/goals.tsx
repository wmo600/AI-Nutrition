import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "../src/store";

const GOALS = [
  {
    id: "muscle",
    title: "Muscle Gain",
    description: "High protein meals to build strength",
  },
  {
    id: "loss",
    title: "Weight Loss",
    description: "Calorie-controlled balanced meals",
  },
  {
    id: "balanced",
    title: "Balanced Diet",
    description: "Nutritious everyday eating",
  },
  {
    id: "health",
    title: "Health Maintenance",
    description: "Maintain your current lifestyle",
  },
];

export default function GoalSettingScreen() {
  const router = useRouter();
  const { prefs, setPrefs } = useAppStore();
  const selected = prefs.goal;

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-16">
      <Text className="text-2xl font-semibold mb-1">
        Choose Your Goal
      </Text>
      <Text className="text-gray-500 mb-6">
        What would you like to achieve?
      </Text>

      {GOALS.map((g) => {
        const active = selected === g.title;
        return (
          <TouchableOpacity
            key={g.id}
            className={`rounded-2xl border mb-4 p-4 ${
              active ? "bg-green-50 border-green-400" : "border-gray-200"
            }`}
            onPress={() => setPrefs({ goal: g.title })}
          >
            <Text
              className={`font-semibold mb-1 ${
                active ? "text-green-700" : "text-gray-900"
              }`}
            >
              {g.title}
            </Text>
            <Text className="text-gray-500 text-sm">{g.description}</Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        disabled={!selected}
        className={`mt-8 rounded-2xl py-3 items-center ${
          selected ? "bg-green-500" : "bg-gray-300"
        }`}
        onPress={() => router.push("/preferences")}
      >
        <Text className="text-white font-semibold">Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
