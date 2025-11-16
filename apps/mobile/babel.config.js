module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // Expo preset with NativeWind JSX transform
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      // NativeWind preset
      "nativewind/babel",
    ],
    // ❌ DO NOT put "expo-router/babel" here on SDK 50+ — it's already in the preset
  };
};
