import Browser from 'webextension-polyfill';
import ProductPurchaseDTO from '../roblox/ProductPurchaseDTO';
import CatalogItemsDetailsShedulerData from '../roblox/CatalogItemsDetailsShedulerData';
import Storage from '../Storage';
import { robloxService } from '../roblox';
import CatalogItemsLink from '../roblox/CatalogItemsLink';
import AlarmsTypes from '../AlarmsTypes';

export default class RobloxSchedulerBackground {
  ALERT_SCHEDULER_MINUTES = 1;

  static INITIAL_STORAGE: Storage = {
    catalogItemsAutoBuyerLimit: 120,
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
      this.alarmsTypes(name);
    });

    Browser.storage.local.onChanged.addListener(({ catalogItemsAutoBuyerEnabled }) => {
      if (catalogItemsAutoBuyerEnabled) {
        this.catalogItemsAutoBuyerEnabled(catalogItemsAutoBuyerEnabled.newValue);
      }
    });
  }

  async catalogItemsAutoBuyerEnabled(catalogItemsAutoBuyerEnabled: boolean) {
    if (
      catalogItemsAutoBuyerEnabled &&
      !!Browser.alarms.get(AlarmsTypes.catalogItemsAutoBuyerEnabled)
    ) {
      await this.fetchAssetDetails();

      Browser.alarms.create(AlarmsTypes.catalogItemsAutoBuyerEnabled, {
        periodInMinutes: this.ALERT_SCHEDULER_MINUTES
      });
    } else {
      Browser.alarms.clearAll();
    }
  }

  async alarmsTypes(alarmsTypes: string) {
    switch (alarmsTypes) {
      case AlarmsTypes.catalogItemsAutoBuyerEnabled: {
        // @ts-ignore
        const storage: Storage = await Browser.storage.local.get(null);
        await this.purchaseFirstItem(storage);

        if (storage.catalogItemsAutoBuyerAssets.length <= 1) {
          await Browser.storage.local.set({ catalogItemsAutoBuyerEnabled: false } as Storage);

          if (await Browser.alarms.clearAll()) {
            await Browser.storage.local.set({
              catalogItemsAutoBuyerEnabled: true
            } as Storage);
          }

          if (storage.catalogItemsAutoBuyerNotification) {
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
      storage.catalogItemsAutoBuyerTotalPages,
      storage.catalogItemsAutoBuyerLimit
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

  async purchaseFirstItem(storage: Storage) {
    if (storage.catalogItemsAutoBuyerAssets.length > 0) {
      const xcsrftoken = await robloxService.getXCsrfToken();

      const { purchased } = await robloxService.purchaseProduct(
        storage.catalogItemsAutoBuyerAssets[0][0],
        new ProductPurchaseDTO(
          0,
          0,
          storage.catalogItemsAutoBuyerAssets[0][1].data.creatorTargetId
        ),
        xcsrftoken
      );

      if (purchased && storage.catalogItemsAutoBuyerNotification) {
        await Browser.notifications.create({
          message: storage.catalogItemsAutoBuyerAssets[0][1].data.description,
          title: storage.catalogItemsAutoBuyerAssets[0][1].data.name,
          iconUrl: '../icon.png',
          type: 'basic',
          isClickable: true,
          contextMessage: CatalogItemsLink.parseCatalogDetails(
            storage.catalogItemsAutoBuyerAssets[0][1].data
          )
        });
      }

      await Browser.storage.local.set({
        catalogItemsAutoBuyerAssets: storage.catalogItemsAutoBuyerAssets.filter(
          ([id]) => id != storage.catalogItemsAutoBuyerAssets[0][0]
        )
      });
    }

    return storage.catalogItemsAutoBuyerAssets.length;
  }
}
