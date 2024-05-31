const path = require("path");

module.exports = {
  resolve: {
    fallback: {
      path: path.resolve(__dirname, "./node_modules/path-browserify"),
      os: path.resolve(__dirname, "./node_modules/os-browserify/browser"),
      crypto: path.resolve(__dirname, "./node_modules/crypto-browserify"),
    },
  },
};
