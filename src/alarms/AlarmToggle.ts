import Browser from 'webextension-polyfill';
import Storage from '../Storage';
import AlarmTypes from './AlarmTypes';

export default class AlarmToggle
  implements Required<Pick<Browser.Alarms.Alarm, 'name' | 'periodInMinutes'>>
{
  static INITIAL_STORAGE: Storage = {
    catalogItemsAutoBuyerLimit: 120,
    catalogItemsAutoBuyerEnabled: false,
    catalogItemsAutoBuyerAssets: [],
    catalogItemsAutoBuyerNotification: true,
    catalogItemsAutoBuyerAssetsTotal: 0,
    catalogItemsAutoBuyerTotalPages: 30,
    limitedUGCInGameNotifierAssets: [],
    limitedUGCInGameNotifierEnabled: false
  };

  constructor(public name: keyof typeof AlarmTypes, public periodInMinutes: number) {
    Browser.runtime.onInstalled.addListener(() => {
      Browser.storage.local.set(AlarmToggle.INITIAL_STORAGE);
    });

    Browser.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === this.name) {
        this.onAlarm();
      }
    });

    Browser.storage.local.onChanged.addListener((changes) => {
      if (this.name in changes) {
        if (changes[this.name].newValue && !!Browser.alarms.get(this.name)) {
          Browser.alarms.create(this.name, {
            periodInMinutes: this.periodInMinutes
          });
          this.onCreate();
        } else {
          Browser.alarms.clear(this.name);
        }
      }
    });
  }

  onAlarm() {}

  onCreate() {}
}
