import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6 pt-16">
      <Text className="text-2xl font-semibold mb-2">Welcome Back</Text>
      <Text className="text-gray-500 mb-8">Sign in to continue</Text>

      <Text className="text-sm text-gray-600 mb-2">Email</Text>
      <View className="bg-gray-100 rounded-xl px-4 py-3 mb-4">
        <TextInput
          placeholder="your@email.com"
          keyboardType="email-address"
        />
      </View>

      <Text className="text-sm text-gray-600 mb-2">Password</Text>
      <View className="bg-gray-100 rounded-xl px-4 py-3 mb-6">
        <TextInput
          placeholder="••••••••"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        className="bg-green-500 rounded-xl py-3 items-center mb-6"
        onPress={() => router.replace("/goals")}
      >
        <Text className="text-white font-semibold">Sign In</Text>
      </TouchableOpacity>

      <View className="flex-row items-center mb-4">
        <View className="flex-1 h-px bg-gray-200" />
        <Text className="mx-3 text-gray-400 text-xs">
          or continue with
        </Text>
        <View className="flex-1 h-px bg-gray-200" />
      </View>

      <TouchableOpacity className="rounded-xl border border-gray-200 py-3 items-center mb-4">
        <Text className="font-medium">Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
        <Text className="text-center text-gray-500">
          Continue as Guest
        </Text>
      </TouchableOpacity>
    </View>
  );
}
