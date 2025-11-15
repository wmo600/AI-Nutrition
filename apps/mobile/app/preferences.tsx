import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "../src/store";

const CUISINES = [
  "Western",
  "Asian",
  "Mediterranean",
  "Indian",
  "Mexican",
  "Japanese",
];

const ALLERGIES = [
  "Gluten-free",
  "Lactose-free",
  "Nut-free",
  "Shellfish-free",
  "Soy-free",
  "Halal",
];

function Tag({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full border mb-2 mr-2 ${
        active
          ? "bg-green-50 border-green-500"
          : "bg-white border-gray-300"
      }`}
    >
      <Text
        className={active ? "text-green-700 font-medium" : "text-gray-800"}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function PreferencesScreen() {
  const router = useRouter();
  const { prefs, setPrefs } = useAppStore();

  const toggle = (field: "cuisines" | "allergies", value: string) => {
    const list = prefs[field];
    const exists = list.includes(value);
    const next = exists
      ? list.filter((x) => x !== value)
      : [...list, value];
    setPrefs({ [field]: next } as any);
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-16">
      <Text className="text-2xl font-semibold mb-1">Preferences</Text>
      <Text className="text-gray-500 mb-6">
        Customize your experience
      </Text>

      <Text className="text-lg font-semibold mb-2">
        Cuisine Preferences
      </Text>
      <View className="flex-row flex-wrap mb-6">
        {CUISINES.map((c) => (
          <Tag
            key={c}
            label={c}
            active={prefs.cuisines.includes(c)}
            onPress={() => toggle("cuisines", c)}
          />
        ))}
      </View>

      <Text className="text-lg font-semibold mb-2">
        Allergies & Restrictions
      </Text>
      <View className="flex-row flex-wrap mb-10">
        {ALLERGIES.map((a) => (
          <Tag
            key={a}
            label={a}
            active={prefs.allergies.includes(a)}
            onPress={() => toggle("allergies", a)}
          />
        ))}
      </View>

      <TouchableOpacity
        className="rounded-2xl py-3 items-center bg-green-500 mb-10"
        onPress={() => router.replace("/(tabs)")}
      >
        <Text className="text-white font-semibold">Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
