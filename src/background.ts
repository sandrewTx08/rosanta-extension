import Browser from 'webextension-polyfill';
import axios from 'axios';
import Roblox from './roblox';

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

// setInterval(() => {
//   Browser.storage.local.get(['catalogAssetDetails']).then(console.log);
// }, 2000);

Browser.runtime.onInstalled.addListener(() => {
  Roblox.controller.setInitialCatalog();

  Browser.storage.local.set({
    enableBot: false,
    catalogAssetDetails: [[NaN, { data: { name: 'Loading' } }]]
  });
});
