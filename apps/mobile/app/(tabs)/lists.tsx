import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { listsStyles as styles } from "../../src/styles/screens";

export default function ShoppingLists() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Shopping Lists</Text>
          <Text style={styles.subtitle}>Manage your grocery lists</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabTextActive}>Active List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      <View style={styles.emptyState}>
        <View style={styles.addIconContainer}>
          <Text style={styles.addIcon}>+</Text>
        </View>
        <Text style={styles.emptyTitle}>No items yet</Text>
        <Text style={styles.emptySubtitle}>Start planning your groceries</Text>
      </View>
    </View>
  );
}
