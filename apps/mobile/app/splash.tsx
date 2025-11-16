import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { splashStyles as styles } from "../src/styles/screens";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      // auto-continue after a bit
    }, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoIcon}>🛒</Text>
      </View>

      <Text style={styles.appName}>SmartCart</Text>
      <Text style={styles.subtitle}>
        Your AI-powered grocery planning assistant
      </Text>

      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.getStartedText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
