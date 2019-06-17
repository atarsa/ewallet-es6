const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = function(){
  return {
    mode: 'development',
    entry: [
      './src/app.js'
    ],
    watch: true,
    watchOptions: {
      aggregateTimeout: 300, // Process all changes which happened in this time into one rebuild
      poll: 1000, // Check for changes every second,
      ignored: /node_modules/,
      // ignored: [
      //   '**/*.scss', '/node_modules/'
      // ]
    },
    devtool: 'source-maps',
    devServer: {
      contentBase: path.join(__dirname, 'src'),
      watchContentBase: true,
      hot: true,
      open: true,
      inline: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'eWallet',
        template: path.resolve('./src/index.html')
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: ['babel-loader']
        },
        {
          test: /\.s?css$/,
          sideEffects: true,
          use: [
            "style-loader", // Inject styles into DOM
            "css-loader", // 2. Turns css into commonjs
            "sass-loader" // 1. Turns sass into css
          ]
        },
        {
          test: /\.(jpg|jpeg|gif|png|svg|webp)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: './images',
                name: "[name].[ext]",
              },
            },
          ]
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
          }
        },
      ]
    }
  };
}