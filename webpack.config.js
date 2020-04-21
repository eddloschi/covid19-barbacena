const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const { DateTime } = require("luxon")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")

module.exports = mode => {
  return {
    mode,
    entry: {
      app: "./src/index.js",
    },
    plugins: [
      // new CleanWebpackPlugin(["dist/*"]) for < v2 versions of CleanWebpackPlugin
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "src/index.html",
        templateParameters: {
          updatedAt: DateTime.local().setLocale('pt-BR').setZone("America/Sao_Paulo").toLocaleString(DateTime.DATETIME_HUGE)
        }
      }),
      new MiniCssExtractPlugin()
    ],
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    externals: {
      moment: "moment"
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
          },
        },
      ]
    }
  }
}
