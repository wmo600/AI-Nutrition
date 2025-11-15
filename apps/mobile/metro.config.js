const { withNativeWind } = require("nativewind/metro");

module.exports = withNativeWind(
  {
    transformer: {
      assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    },
  },
  {
    input: "./tailwind.config.js",
  }
);
