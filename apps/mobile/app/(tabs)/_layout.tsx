// apps/mobile/app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => ( // Add color here
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color} // Pass it to Ionicons
            />
          ),
        }}
      />
    </Tabs>
  );
}