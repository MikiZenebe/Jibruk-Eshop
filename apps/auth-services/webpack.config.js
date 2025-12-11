const { join, resolve } = require("path");
const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin");

module.exports = {
  output: {
    path: join(__dirname, "dist"),
  },
  resolve: {
    alias: {
      "@packages": resolve(__dirname, "../../packages"),
    },
    extension: [".ts", ".js"],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: "node",
      compiler: "tsc",
      main: "./src/main.ts",
      tsConfig: "./tsconfig.app.json",
      optimization: false,
      outputHashing: "none",
      generatePackageJson: true,
    }),
  ],
};
