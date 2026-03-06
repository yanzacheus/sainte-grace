const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: false,
    }),
    new CopyPlugin({
      patterns: [
        { from: 'img', to: 'img' },
        { from: 'css', to: 'css' },
        { from: 'js/vendor', to: 'js/vendor' },
        { from: 'icon.svg', to: 'icon.svg' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'favicon-48x48.png', to: 'favicon-48x48.png' },
        { from: 'favicon-96x96.png', to: 'favicon-96x96.png' },
        { from: 'robots.txt', to: 'robots.txt' },
        { from: 'sitemap.xml', to: 'sitemap.xml' },
        { from: 'icon.png', to: 'icon.png' },
        { from: 'icon-192.png', to: 'icon-192.png' },
        { from: 'icon-512.png', to: 'icon-512.png' },
        { from: '404.html', to: '404.html' },
        { from: 'mentions-legales.html', to: 'mentions-legales.html' },
        { from: 'site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
  ],
});
