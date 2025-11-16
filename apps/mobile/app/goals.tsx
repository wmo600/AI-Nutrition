import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "../src/store";
import { goalsStyles as styles } from "../src/styles/screens";
import { colors } from "../src/styles/theme";

const GOALS = [
  {
    id: "muscle",
    title: "Muscle Gain",
    description: "High protein meals to build strength",
    icon: "💪",
    color: colors.blue[100],
  },
  {
    id: "loss",
    title: "Weight Loss",
    description: "Calorie-controlled balanced meals",
    icon: "⚖️",
    color: colors.purple[100],
  },
  {
    id: "balanced",
    title: "Balanced Diet",
    description: "Nutritious everyday eating",
    icon: "📈",
    color: colors.green[100],
  },
  {
    id: "health",
    title: "Health Maintenance",
    description: "Maintain your current lifestyle",
    icon: "❤️",
    color: colors.pink[100],
  },
];

export default function GoalSettingScreen() {
  const router = useRouter();
  const { prefs, setPrefs } = useAppStore();
  const selected = prefs.goal;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Choose Your Goal</Text>
      <Text style={styles.subtitle}>What would you like to achieve?</Text>

      {GOALS.map((g) => {
        const active = selected === g.title;
        return (
          <TouchableOpacity
            key={g.id}
            style={[
              styles.goalCard,
              active && styles.goalCardActive,
            ]}
            onPress={() => setPrefs({ goal: g.title })}
          >
            <View style={[styles.iconContainer, { backgroundColor: g.color }]}>
              <Text style={styles.icon}>{g.icon}</Text>
            </View>
            <View style={styles.goalContent}>
              <Text style={[styles.goalTitle, active && styles.goalTitleActive]}>
                {g.title}
              </Text>
              <Text style={styles.goalDescription}>{g.description}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        disabled={!selected}
        style={[
          styles.continueButton,
          !selected && styles.continueButtonDisabled,
        ]}
        onPress={() => router.push("/preferences")}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
