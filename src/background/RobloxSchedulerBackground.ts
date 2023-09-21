import Browser from 'webextension-polyfill';
import ProductPurchaseDTO from '../roblox/ProductPurchaseDTO';
import CatalogItemsDetailsShedulerData from '../roblox/CatalogItemsDetailsShedulerData';
import Storage from '../Storage';
import { robloxCatalogService, robloxTokenService, robloxUserService } from '../roblox';
import CatalogItemsLink from '../roblox/CatalogItemsLink';
import AlarmsTypes from '../AlarmsTypes';

export default class RobloxSchedulerBackground {
  ALERT_SCHEDULER_MINUTES = 1;
  purchasesMultiplier = 2;

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

        if (storage.catalogItemsAutoBuyerAssets.length <= this.purchasesMultiplier) {
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
    const catalogItemsAutoBuyerAssets = await robloxCatalogService.findManyFreeItemsAssetDetails(
      storage.catalogItemsAutoBuyerTotalPages,
      storage.catalogItemsAutoBuyerLimit
    );

    const robloxUser = await robloxUserService.getAuthenticatedUser();

    return Browser.storage.local.set({
      robloxUser,
      catalogItemsAutoBuyerAssetsTotal: catalogItemsAutoBuyerAssets.length,
      catalogItemsAutoBuyerAssets: catalogItemsAutoBuyerAssets.map<
        Storage['catalogItemsAutoBuyerAssets'][0]
      >((data) => [data.productId, new CatalogItemsDetailsShedulerData(data)])
    } as Storage);
  }

  async purchaseFirstItem(storage: Storage) {
    const filteredIds: number[] = [];
    const xcsrftoken = await robloxTokenService.getXCsrfToken();

    for (let i = 0; i < this.purchasesMultiplier - 1; i++) {
      filteredIds.push(storage.catalogItemsAutoBuyerAssets[i][0]);

      const { purchased } = await robloxCatalogService.purchaseProduct(
        storage.catalogItemsAutoBuyerAssets[i][0],
        new ProductPurchaseDTO(
          0,
          0,
          storage.catalogItemsAutoBuyerAssets[i][1].data.creatorTargetId
        ),
        xcsrftoken
      );

      if (purchased && storage.catalogItemsAutoBuyerNotification) {
        await Browser.notifications.create({
          message: storage.catalogItemsAutoBuyerAssets[i][1].data.description,
          title: storage.catalogItemsAutoBuyerAssets[i][1].data.name,
          iconUrl: '../icon.png',
          type: 'basic',
          isClickable: true,
          contextMessage: CatalogItemsLink.parseCatalogDetails(
            storage.catalogItemsAutoBuyerAssets[i][1].data
          )
        });
      }
    }

    await Browser.storage.local.set({
      catalogItemsAutoBuyerAssets: storage.catalogItemsAutoBuyerAssets.filter(
        ([id1]) => id1 != filteredIds.find((id2) => id2 == id1)
      )
    });
  }
}
