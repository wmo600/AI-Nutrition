import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { plannerStyles as styles } from "../../src/styles/screens";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export default function GroceryPlanner() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Grocery Planner</Text>
        <Text style={styles.subtitle}>Plan your weekly groceries</Text>
      </View>

      {/* Meal Types */}
      <Text style={styles.sectionTitle}>Select Meal Types</Text>
      <View style={styles.mealTypesContainer}>
        {MEAL_TYPES.map((meal, index) => (
          <TouchableOpacity
            key={meal}
            style={[
              styles.mealTypeButton,
              index % 2 === 0 ? styles.mealTypeButtonLeft : styles.mealTypeButtonRight,
            ]}
          >
            <Text style={styles.mealTypeText}>{meal}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Items */}
      <Text style={styles.sectionTitle}>Add Custom Items</Text>
      <View style={styles.customItemContainer}>
        <TextInput
          style={styles.customItemInput}
          placeholder="e.g., Organic eggs"
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Planning Tips */}
      <View style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Text style={styles.tipsIcon}>💡</Text>
          <Text style={styles.tipsTitle}>Planning Tips</Text>
        </View>
        <Text style={styles.tipText}>• Select meal types for personalized suggestions</Text>
        <Text style={styles.tipText}>• Add specific items you need</Text>
        <Text style={styles.tipText}>• We'll find the best prices across stores</Text>
      </View>

      {/* Generate Button */}
      <TouchableOpacity style={styles.generateButton}>
        <Text style={styles.generateIcon}>✨</Text>
        <Text style={styles.generateText}>Generate AI Plan</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
}
