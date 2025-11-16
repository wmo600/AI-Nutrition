import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: "AI Nutrition Mobile",
  slug: "ai-nutrition-mobile-dev",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  scheme: "ainutrition",
  
  plugins: [
    "expo-router"
  ],
  
  experiments: {
    typedRoutes: true,
  },
  
  splash: {
    backgroundColor: "#ffffff",
    resizeMode: "contain"
    // No image specified - will use background color only
  },
  
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.wmo.ainutrition"
  },
  
  android: {
    package: "com.wmo.ainutrition"
  },
  
  updates: {
    enabled: false,
    fallbackToCacheTimeout: 0,
  },
});