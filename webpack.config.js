const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: path.resolve(__dirname, 'src', 'scripts', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.[contenthash].js',
      publicPath: isProduction ? '/mesto-project-ff/' : '/',
      clean: true,
    },
    devtool: isProduction ? false : 'source-map',
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      open: true,
      port: 8080,
      hot: true,
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.html'),
        filename: 'index.html',
        minify: isProduction
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.[contenthash].css',
      }),
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('NoJekyllPlugin', () => {
            fs.writeFileSync(path.join(__dirname, 'dist', '.nojekyll'), '');
          });
        },
      },
    ],
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
          options: {
            sources: {
              urlFilter: (attribute, value) => Boolean(value),
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[hash][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash][ext]',
          },
        },
      ],
    },
    optimization: {
      minimizer: ['...', new CssMinimizerPlugin()],
      minimize: isProduction,
    },
  };
};
