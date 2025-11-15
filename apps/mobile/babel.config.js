// apps/mobile/babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // Expo preset, with jsxImportSource so NativeWind can hook into JSX
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      // NativeWind as *preset*, not plugin
      "nativewind/babel",
    ],
    plugins: [
      // Expo Router plugin
      "expo-router/babel",
      // (Optional) add more plugins here later, e.g. reanimated
      // "react-native-reanimated/plugin",
    ],
  };
};
