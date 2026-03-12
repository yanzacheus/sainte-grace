const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

function minifyCss(sourceBuffer) {
  const source = sourceBuffer.toString();
  let output = '';
  let index = 0;
  let inString = false;
  let quote = '';
  let escaped = false;

  while (index < source.length) {
    const current = source[index];
    const next = source[index + 1];

    if (inString) {
      output += current;
      if (escaped) {
        escaped = false;
      } else if (current === '\\') {
        escaped = true;
      } else if (current === quote) {
        inString = false;
        quote = '';
      }
      index += 1;
      continue;
    }

    if (current === '"' || current === "'") {
      inString = true;
      quote = current;
      output += current;
      index += 1;
      continue;
    }

    if (current === '/' && next === '*') {
      const keepComment = source[index + 2] === '!';
      let end = index + 2;
      while (end < source.length && !(source[end] === '*' && source[end + 1] === '/')) {
        end += 1;
      }
      if (keepComment) {
        output += source.slice(index, end + 2);
      }
      index = end + 2;
      continue;
    }

    if (/\s/.test(current)) {
      let end = index + 1;
      while (end < source.length && /\s/.test(source[end])) {
        end += 1;
      }
      const previous = output[output.length - 1] || '';
      const following = source[end] || '';
      const needsSpace =
        /[a-zA-Z0-9_#.%\-\)]/.test(previous) && /[a-zA-Z0-9_#.%\-(]/.test(following);
      if (needsSpace) {
        output += ' ';
      }
      index = end;
      continue;
    }

    output += current;
    index += 1;
  }

  output = output
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();

  return Buffer.from(`${output}\n`);
}

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
        {
          from: 'css',
          to: 'css',
          transform(content, absoluteFrom) {
            if (!absoluteFrom.endsWith('.css')) {
              return content;
            }
            return minifyCss(content);
          },
        },
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
        { from: 'sw.js', to: 'sw.js' },
      ],
    }),
  ],
});
