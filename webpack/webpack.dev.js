import { merge } from 'webpack-merge';
import common, { isChromium } from './webpack.common.js';
import WebExtPlugin from 'web-ext-plugin';

export default merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new WebExtPlugin({
      startUrl: isChromium ? 'chrome://extensions/' : 'about:debugging#/runtime/this-firefox',
      sourceDir: '../../dist',
      devtools: true,
      target: [isChromium ? 'chromium' : 'firefox-desktop'],
      runLint: !isChromium
    })
  ]
});
