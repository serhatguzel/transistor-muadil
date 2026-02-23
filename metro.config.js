const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow bundling custom data assets (CSV/TXT) used by the app.
config.resolver.assetExts.push('csv');
config.resolver.assetExts.push('txt');

module.exports = config;
