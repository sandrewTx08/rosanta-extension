import Browser from 'webextension-polyfill';
import ProductPurchaseDTO from '../roblox/ProductPurchaseDTO';
import CatalogItemsDetailsShedulerData from '../roblox/CatalogItemsDetailsShedulerData';
import Storage from '../Storage';
import { robloxService } from '../roblox';
import AlarmsTypes from '../AlarmsTypes';
import CatalogItemsLink from '../roblox/CatalogItemsLink';

export default class RobloxSchedulerBackground {
  ALERT_SCHEDULER_MINUTES = 1;

  static INITIAL_STORAGE: Storage = {
    catalogItemsAutoBuyerEnabled: false,
    catalogItemsAutoBuyerAssets: [],
    catalogItemsAutoBuyerNotification: true,
    catalogItemsAutoBuyerAssetsTotal: 0,
    catalogItemsAutoBuyerTotalPages: 30
  };

  constructor() {
    Browser.runtime.onInstalled.addListener(() => {
      Browser.storage.local.set(RobloxSchedulerBackground.INITIAL_STORAGE);
    });

    Browser.alarms.onAlarm.addListener(({ name }) => {
      this.alarmCallback(AlarmsTypes[name]);
    });

    Browser.storage.local.onChanged.addListener(({ catalogItemsAutoBuyerEnabled }) => {
      this.enableScheduler(catalogItemsAutoBuyerEnabled && catalogItemsAutoBuyerEnabled.newValue);
    });
  }

  enableScheduler(catalogItemsAutoBuyerEnabled: boolean) {
    if (catalogItemsAutoBuyerEnabled && !!Browser.alarms.get(AlarmsTypes.ACTIVE_BOT)) {
      this.fetchAssetDetails();
      Browser.alarms.create(AlarmsTypes.ACTIVE_BOT, {
        delayInMinutes: this.ALERT_SCHEDULER_MINUTES,
        periodInMinutes: this.ALERT_SCHEDULER_MINUTES
      });
    } else {
      Browser.alarms.clearAll();
    }
  }

  async alarmCallback(alarmsTypes: AlarmsTypes) {
    switch (alarmsTypes) {
      case AlarmsTypes.ACTIVE_BOT: {
        const length = await this.purchaseFirstItem();

        if (length && length <= 0) {
          await Browser.storage.local.set({ catalogItemsAutoBuyerEnabled: false } as Storage);

          const value = await Browser.alarms.clearAll();

          if (value) {
            await Browser.storage.local.set({
              catalogItemsAutoBuyerEnabled: true
            } as Storage);
          }

          const { catalogItemsAutoBuyerNotification } = await Browser.storage.local.get(null);

          if (catalogItemsAutoBuyerNotification) {
            await Browser.notifications.create({
              message: '',
              title: 'RoSanta auto-buyer is finished successfully',
              iconUrl: '../icon.png',
              type: 'basic'
            });
          }
        }

        break;
      }
    }
  }

  async fetchAssetDetails() {
    // @ts-ignore
    const storage: Storage = await Browser.storage.local.get(null);
    const data = await robloxService.findManyFreeItemsAssetDetails(
      storage.catalogItemsAutoBuyerTotalPages
    );

    return Browser.storage.local.set({
      catalogItemsAutoBuyerAssetsTotal: data.length,
      catalogItemsAutoBuyerAssets: data.map<Storage['catalogItemsAutoBuyerAssets'][0]>(
        (data, i) => [
          data.productId,
          new CatalogItemsDetailsShedulerData(
            data,
            new Date(Date.now() + this.ALERT_SCHEDULER_MINUTES * 60_000 * (i + 1)).toISOString()
          )
        ]
      )
    } as Storage);
  }

  async purchaseFirstItem() {
    // @ts-ignore
    const stoge: Storage = await Browser.storage.local.get(null);

    if (stoge.catalogItemsAutoBuyerAssets && stoge.catalogItemsAutoBuyerEnabled) {
      const xcsrftoken = await robloxService.getXCsrfToken();

      const { purchased } = await robloxService.purchaseProduct(
        stoge.catalogItemsAutoBuyerAssets[0][0],
        new ProductPurchaseDTO(0, 0, stoge.catalogItemsAutoBuyerAssets[0][1].data.creatorTargetId),
        xcsrftoken
      );

      if (purchased && stoge.catalogItemsAutoBuyerNotification) {
        await Browser.notifications.create({
          message: stoge.catalogItemsAutoBuyerAssets[0][1].data.description,
          title: stoge.catalogItemsAutoBuyerAssets[0][1].data.name,
          iconUrl: '../icon.png',
          type: 'basic',
          isClickable: true,
          contextMessage: CatalogItemsLink.parseCatalogDetails(
            stoge.catalogItemsAutoBuyerAssets[0][1].data
          )
        });
      }

      await Browser.storage.local.set({
        catalogItemsAutoBuyerAssets: stoge.catalogItemsAutoBuyerAssets.filter(
          ([id]) => id != stoge.catalogItemsAutoBuyerAssets[0][0]
        )
      });

      return stoge.catalogItemsAutoBuyerAssets.length;
    }
  }
}
