const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    app: "./src/index.js",
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        include: path.resolve(__dirname, "src"),
        oneOf: [
          {
            resourceQuery: "?dark",
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              {
                loader: "sass-loader",
                options: {
                  additionalData: "@use 'dark-theme/vars' as vars;",
                },
              },
            ],
          },
          {
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              {
                loader: "sass-loader",
                options: {
                  additionalData: "@use 'light-theme/vars' as vars;",
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.svg/,
        type: "asset/inline",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      filename: "index.bundle.html",
      template: "./src/index.html",
      minify: true,
    }),
    new MiniCssExtractPlugin({
      filename: "main-style.css",
      attributes: {
        id: "theme",
      },
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  optimization: {
    runtimeChunk: "single",
    minimizer: [new CssMinimizerPlugin()],
    minimize: true,
  },
};
