import Browser from 'webextension-polyfill';
import ProductPurchaseDTO from '../roblox/ProductPurchaseDTO';
import CatalogItemsDetailsShedulerData from '../roblox/CatalogItemsDetailsShedulerData';
import Storage from '../Storage';
import { robloxService } from '../roblox';
import AlarmsTypes from '../AlarmsTypes';

export default class Background {
  SCHEDULER_MINUTES = 1;

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
          Browser.alarms.create(AlarmsTypes.ACTIVE_BOT, {
            delayInMinutes: this.SCHEDULER_MINUTES,
            periodInMinutes: this.SCHEDULER_MINUTES
          });
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
        catalogAssetDetails: data.map<Storage['catalogAssetDetails'][0]>((data, i) => [
          data.productId,
          new CatalogItemsDetailsShedulerData(
            data,
            new Date(Date.now() + this.SCHEDULER_MINUTES * i).toISOString()
          )
        ])
      } as Storage);
    });
  }

  purchaseFirstItem() {
    Browser.storage.local
      .get(['catalogAssetDetails', 'enableBot', 'purchasesNotification'] as (keyof Storage)[])
      // @ts-ignore
      .then(({ catalogAssetDetails, enableBot, purchasesNotification }: Storage) => {
        if (
          catalogAssetDetails &&
          enableBot &&
          Date.now() >= new Date(catalogAssetDetails[0][1].alertISODate).getTime()
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
