import Browser from 'webextension-polyfill';
import ProductPurchaseDTO from '../roblox/ProductPurchaseDTO';
import AssetsPurchaser from '../roblox/AssetsPurchaser';
import Storage from '../Storage';
import { robloxService } from '../roblox';
import AlarmsTypes from '../AlarmsTypes';

export default class Background {
  PURCHASE_TIMEOUT = 60_000;

  constructor() {
    Browser.runtime.onInstalled.addListener(() => {
      Browser.storage.local.set({
        enableBot: false,
        catalogAssetDetails: [],
        purchasesNotification: true,
        catalogAssetDetailsTotal: 0
      } as Storage);
    });

    Browser.alarms.onAlarm.addListener(({ name }) => {
      switch (name) {
        case AlarmsTypes.ACTIVE_BOT: {
          this.purchaseFirstItem();
          break;
        }
      }
    });

    Browser.storage.local.onChanged.addListener(({ enableBot }) => {
      if (enableBot) {
        if (enableBot.newValue && !!Browser.alarms.get(AlarmsTypes.ACTIVE_BOT)) {
          this.fetchAssets();
          Browser.alarms.create(AlarmsTypes.ACTIVE_BOT, { delayInMinutes: 1, periodInMinutes: 1 });
        } else {
          Browser.alarms.clearAll();
        }
      }
    });
  }

  fetchAssets() {
    // @ts-ignore
    robloxService.findManyFreeItemsAssetDetails().then((data) => {
      Browser.storage.local.set({
        catalogAssetDetailsTotal: data.length,
        catalogAssetDetails: data.map<[number, AssetsPurchaser]>((data, i) => [
          data.productId,
          new AssetsPurchaser(data, new Date(Date.now() + this.PURCHASE_TIMEOUT * i).toISOString())
        ])
      });
    });
  }

  purchaseFirstItem() {
    Browser.storage.local
      .get(['catalogAssetDetails', 'enableBot', 'purchasesNotification'])
      // @ts-ignore
      .then(({ catalogAssetDetails, enableBot, purchasesNotification }: Storage) => {
        if (
          catalogAssetDetails &&
          enableBot &&
          Date.now() >= new Date(catalogAssetDetails[0][1].nextBuy).getTime()
        ) {
          robloxService.getXCsrfToken().then((xcsrftoken) => {
            robloxService
              .purchaseProduct(
                catalogAssetDetails[0][0],
                new ProductPurchaseDTO(0, 0, catalogAssetDetails[0][1].data.creatorTargetId),
                xcsrftoken
              )
              .then(({ purchased }) => {
                if (purchased && purchasesNotification) {
                  Browser.notifications.create({
                    message: catalogAssetDetails[0][1].data.description,
                    title: catalogAssetDetails[0][1].data.name,
                    iconUrl: '../icon.png',
                    type: 'basic',
                    isClickable: true,
                    contextMessage:
                      catalogAssetDetails[0][1].data.itemType == 'Bundle'
                        ? `https://www.roblox.com/bundles/${catalogAssetDetails[0][1].data.id}`
                        : `https://www.roblox.com/catalog/${catalogAssetDetails[0][0]}`
                  });
                }
              });

            Browser.storage.local.set({
              catalogAssetDetails: catalogAssetDetails.filter(
                ([id]) => id != catalogAssetDetails[0][0]
              )
            });
          });
        }
      });
  }
}
