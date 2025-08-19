module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@api': './common/animalmarket-api/src/api',
          '@config': './common/animalmarket-api/src/config',
          '@services': './common/animalmarket-api/src/services',
          '@errors': './common/animalmarket-api/src/errors',
          'screens': './screens',
          'components': './components',
          'navigation': './navigation',
          'src': './src',
        },
      },
    ],
  ],
};
