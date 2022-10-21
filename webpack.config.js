const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => ({
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      // JavaScript
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      // CSS
      // Modular and non-Modular
      {
        test: /\.css$/,
        include: /\.module\.css$/,
        exclude: /(node_modules)/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              // importLoaders: 0,1,2 - ЭТО НУЖНО, ПРИ ИСПОЛЬЗОВАНИИ С SASS
              modules: {
                localIdentName: '[local]__[sha1:hash:hex:7]',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: [/(node_modules)/, /\.module\.css$/],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: false,
            },
          },
        ],
      },
      // HTML
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          }
        ],
      },
      // Images
      {
        test: /.*\.(jpe?g|png|svg)$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]', // name: '[hash].[ext]',
            outputPath: 'img',
            esModule: false,
          }
        }
      },
    ],
  },
  
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      chunks: ['main']
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',      
    }),
  ],

  devServer: {
    port: 5000,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
  },
  
  // Следующая настройка может чудовищно снижать производительность программы.
  devtool: argv.mode === 'development' ? 'source-map' : false,
});