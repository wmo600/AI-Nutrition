import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: "AI Nutrition Mobile",
  slug: "ai-nutrition-mobile-dev",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  scheme: "ainutrition",
  
  plugins: [
    "expo-router",
    "expo-asset" // Remove "nativewind/metro" from here
  ],
  
  experiments: {
    typedRoutes: true,
  },
  
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.wmo.ainutrition"
  },
  
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.wmo.ainutrition"
  },
  
  updates: {
    enabled: false,
    fallbackToCacheTimeout: 0,
  },
  
  web: {
    favicon: "./assets/favicon.png"
  }
});