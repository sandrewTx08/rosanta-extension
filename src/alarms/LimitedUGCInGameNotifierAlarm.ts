import Browser from 'webextension-polyfill';
import { robloxCatalogService } from '../roblox';
import AlarmToggle from './AlarmToggle';
import AlarmTypes from './AlarmTypes';
import Storage from '../Storage';

export default class LimitedUGCInGameNotifierAlarm extends AlarmToggle {
  constructor() {
    super(AlarmTypes.limitedUGCInGameNotifierEnabled, 5);
  }

  override async onAlarm() {
    // @ts-ignore
    const storage: Storage = await Browser.storage.local.get(null);
    const limitedUGCInGameNotifierAssets = await robloxCatalogService.findManyUGCLimited();

    if (storage.limitedUGCInGameNotifierAssets[0].name !== limitedUGCInGameNotifierAssets[0].name) {
      await Browser.notifications.create({
        message: 'New limited UGC is now available in game',
        title: `${limitedUGCInGameNotifierAssets[0].name} - ${limitedUGCInGameNotifierAssets[0].description}`,
        iconUrl: '../icon.png',
        type: 'basic'
      });
    }

    await Browser.storage.local.set({ limitedUGCInGameNotifierAssets } as Storage);
  }

  override async onCreate() {
    Browser.storage.local.set({
      limitedUGCInGameNotifierAssets: await robloxCatalogService.findManyUGCLimited()
    } as Storage);
  }
}
