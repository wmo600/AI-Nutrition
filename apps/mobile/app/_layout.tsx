// apps/mobile/app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* You don't *have* to list these, but it’s nice for options later */}
      <Stack.Screen name="splash" />
      <Stack.Screen name="login" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
