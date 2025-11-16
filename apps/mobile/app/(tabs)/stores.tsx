import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { storesStyles as styles } from "../../src/styles/screens";

const STORES = [
  {
    name: "FairPrice Xtra VivoCity",
    distance: "0.8 km",
    status: "Open",
    address: "1 HarbourFront Walk, #B2-01",
    hours: "8:00 AM - 10:00 PM",
    phone: "+65 6123 4567",
  },
  {
    name: "Cold Storage Orchard",
    distance: "1.2 km",
    status: "Open",
    address: "290 Orchard Road, #B1-07",
    hours: "9:00 AM - 9:00 PM",
    phone: "+65 6234 5678",
  },
];

export default function NearbyStores() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Nearby Stores</Text>
          <Text style={styles.subtitle}>Find supermarkets near you</Text>
        </View>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapIcon}>📍</Text>
        <Text style={styles.mapText}>Map view</Text>
        <TouchableOpacity style={styles.locationButton}>
          <Text style={styles.locationIcon}>🧭</Text>
        </TouchableOpacity>
      </View>

      {/* Stores List */}
      <View style={styles.storesHeader}>
        <Text style={styles.storesTitle}>Stores Near You</Text>
        <TouchableOpacity>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.storesList} contentContainerStyle={styles.storesContent}>
        {STORES.map((store, index) => (
          <View key={index} style={styles.storeCard}>
            <View style={styles.storeHeader}>
              <View style={styles.storeInfo}>
                <Text style={styles.storeName}>{store.name}</Text>
                <View style={styles.storeMetaRow}>
                  <Text style={styles.statusBadge}>{store.status}</Text>
                  <Text style={styles.distance}>• {store.distance}</Text>
                </View>
              </View>
              <View style={styles.locationPinContainer}>
                <Text style={styles.locationPin}>📍</Text>
              </View>
            </View>

            <View style={styles.storeDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📍</Text>
                <Text style={styles.detailText}>{store.address}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>🕐</Text>
                <Text style={styles.detailText}>{store.hours}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📞</Text>
                <Text style={styles.detailText}>{store.phone}</Text>
              </View>
            </View>

            <View style={styles.storeActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shopButton}>
                <Text style={styles.shopButtonText}>Shop Here</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
