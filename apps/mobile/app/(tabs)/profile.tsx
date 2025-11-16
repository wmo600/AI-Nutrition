import { View, Text } from "react-native";
import { profileStyles as styles } from "../../src/styles/screens";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}
