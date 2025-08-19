// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = mergeConfig(config, {
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
    resolver: {
        assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...config.resolver.sourceExts, 'svg', 'ts', 'tsx'],
    },
});
