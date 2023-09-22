import Browser from 'webextension-polyfill';
import ProductPurchaseDTO from '../roblox/ProductPurchaseDTO';
import Storage from '../Storage';
import { robloxCatalogService, robloxTokenService, robloxUserService } from '../roblox';
import CatalogItemsLink from '../roblox/CatalogItemsLink';
import AlarmTypes from './AlarmTypes';
import AlarmToggle from './AlarmToggle';

export default class RobloxFreeAutoBuyerAlarm extends AlarmToggle {
  constructor(public purchasesMultiplier: number = 2) {
    super(AlarmTypes.catalogItemsAutoBuyerEnabled, 1);
  }

  override async onCreate() {
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
      catalogItemsAutoBuyerAssets
    } as Storage);
  }

  override async onAlarm() {
    // @ts-ignore
    const storage: Storage = await Browser.storage.local.get(null);

    // TODO: fix index 0 error
    try {
      await this.purchaseItems(storage);
    } catch (error) {}

    if (storage.catalogItemsAutoBuyerAssets.length <= this.purchasesMultiplier) {
      this.onCreate();
    }
  }

  async purchaseItems(storage: Storage) {
    const filteredIds: number[] = [];
    const xcsrftoken = await robloxTokenService.getXCsrfToken();

    for (let i = 0; i < this.purchasesMultiplier; i++) {
      filteredIds.push(storage.catalogItemsAutoBuyerAssets[i].productId);

      const { purchased } = await robloxCatalogService.purchaseProduct(
        storage.catalogItemsAutoBuyerAssets[i].productId,
        new ProductPurchaseDTO(0, 0, storage.catalogItemsAutoBuyerAssets[i].creatorTargetId),
        xcsrftoken
      );

      if (purchased && storage.catalogItemsAutoBuyerNotification) {
        await Browser.notifications.create({
          message: storage.catalogItemsAutoBuyerAssets[i].description,
          title: storage.catalogItemsAutoBuyerAssets[i].name,
          iconUrl: '../icon.png',
          type: 'basic',
          contextMessage: CatalogItemsLink.parseCatalogDetails(
            storage.catalogItemsAutoBuyerAssets[i]
          )
        });
      }
    }

    await Browser.storage.local.set({
      catalogItemsAutoBuyerAssets: storage.catalogItemsAutoBuyerAssets.filter(
        (d1) => d1.productId != filteredIds.find((d2) => d2 == d1.productId)
      )
    });
  }
}
