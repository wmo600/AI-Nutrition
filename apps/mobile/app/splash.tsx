import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      // auto-continue after a bit
    }, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View className="flex-1 bg-green-500 items-center justify-center px-8">
      {/* Logo */}
      <View className="bg-white rounded-3xl w-24 h-24 items-center justify-center mb-8 shadow-lg">
        <Text className="text-3xl">🛒</Text>
      </View>

      <Text className="text-white text-2xl font-semibold mb-2">
        SmartCart
      </Text>
      <Text className="text-white/90 text-center mb-12">
        Your AI-powered grocery planning assistant
      </Text>

      <TouchableOpacity
        className="bg-white rounded-2xl px-10 py-3"
        onPress={() => router.replace("/login")}
      >
        <Text className="text-green-600 font-semibold">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
