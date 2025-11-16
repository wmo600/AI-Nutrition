import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "../src/store";
import { preferencesStyles as styles } from "../src/styles/screens";

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
      style={[styles.tag, active && styles.tagActive]}
    >
      <Text style={[styles.tagText, active && styles.tagTextActive]}>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Preferences</Text>
      <Text style={styles.subtitle}>Customize your experience</Text>

      <Text style={styles.sectionTitle}>Cuisine Preferences</Text>
      <View style={styles.tagContainer}>
        {CUISINES.map((c) => (
          <Tag
            key={c}
            label={c}
            active={prefs.cuisines.includes(c)}
            onPress={() => toggle("cuisines", c)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Allergies & Restrictions</Text>
      <View style={styles.tagContainer}>
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
        style={styles.continueButton}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
