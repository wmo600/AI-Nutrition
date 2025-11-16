import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useAppStore } from "../../src/store";
import { homeStyles as styles } from "../../src/styles/screens";
import { colors } from "../../src/styles/theme";

export default function HomeDashboard() {
  const router = useRouter();
  const { prefs } = useAppStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Goal Header */}
      <View style={styles.header}>
        <View style={styles.goalContainer}>
          <Text style={styles.goalLabel}>Your Goal</Text>
          <View style={styles.goalRow}>
            <Text style={styles.goalIcon}>📈</Text>
            <Text style={styles.goalText}>
              {prefs.goal || "Health Maintenance"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search groceries or meals"
          placeholderTextColor={colors.gray[400]}
        />
      </View>

      {/* Action Tiles */}
      <View style={styles.tilesContainer}>
        <ActionTile
          icon="🛒"
          title="Plan Groceries"
          color={colors.green[100]}
          onPress={() => router.push("/(tabs)/planner")}
        />
        <ActionTile
          icon="⭐"
          title="AI Recommendations"
          color={colors.purple[100]}
          onPress={() => router.push("/planner-recommendations")}
        />
        <ActionTile
          icon="📍"
          title="Find Stores"
          color={colors.blue[100]}
          onPress={() => router.push("/(tabs)/stores")}
        />
        <ActionTile
          icon="📝"
          title="My Lists"
          color={colors.pink[100]}
          onPress={() => router.push("/(tabs)/lists")}
        />
      </View>

      {/* Weekly Deals */}
      <Text style={styles.sectionTitle}>Weekly Deals</Text>

      <View style={[styles.dealCard, styles.greenDeal]}>
        <Text style={styles.dealTitle}>20% off all vegetables</Text>
        <Text style={styles.dealStore}>FairPrice</Text>
      </View>

      <View style={[styles.dealCard, styles.blueDeal]}>
        <Text style={styles.dealTitle}>Buy 2 Get 1 Free Yogurt</Text>
        <Text style={styles.dealStore}>Cold Storage</Text>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

type TileProps = {
  icon: string;
  title: string;
  color: string;
  onPress: () => void;
};

function ActionTile({ icon, title, color, onPress }: TileProps) {
  return (
    <TouchableOpacity style={styles.tile} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.tileContent}>
        <View style={[styles.tileIcon, { backgroundColor: color }]}>
          <Text style={styles.tileIconText}>{icon}</Text>
        </View>
        <Text style={styles.tileTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
