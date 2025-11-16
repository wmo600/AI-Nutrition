// import "../global.css"; // Comment this out temporarily
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="login" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}