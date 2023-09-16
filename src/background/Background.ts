import Browser from 'webextension-polyfill';
import ProductPurchaseDTO from '../roblox/ProductPurchaseDTO';
import CatalogItemsDetailsShedulerData from '../roblox/CatalogItemsDetailsShedulerData';
import Storage from '../Storage';
import { robloxService } from '../roblox';
import AlarmsTypes from '../AlarmsTypes';
import CatalogItemsLink from '../roblox/CatalogItemsLink';

export default class Background {
  ALERT_SCHEDULER_MINUTES = 1;

  constructor() {
    Browser.runtime.onInstalled.addListener(() => {
      Browser.storage.local.set({
        catalogItemsAutoBuyerEnabled: false,
        catalogItemsAutoBuyerAssets: [],
        catalogItemsAutoBuyerNotification: true,
        catalogItemsAutoBuyerAssetsTotal: 0
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

    Browser.storage.local.onChanged.addListener(({ catalogItemsAutoBuyerEnabled }) => {
      if (catalogItemsAutoBuyerEnabled) {
        if (catalogItemsAutoBuyerEnabled.newValue && !!Browser.alarms.get(AlarmsTypes.ACTIVE_BOT)) {
          this.fetchAssets();
          Browser.alarms.create(AlarmsTypes.ACTIVE_BOT, {
            delayInMinutes: this.ALERT_SCHEDULER_MINUTES,
            periodInMinutes: this.ALERT_SCHEDULER_MINUTES
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
    });
  }

  purchaseFirstItem() {
    Browser.storage.local
      .get([
        'catalogItemsAutoBuyerAssets',
        'catalogItemsAutoBuyerEnabled',
        'catalogItemsAutoBuyerNotification'
      ] as (keyof Storage)[])

      .then(
        // @ts-ignore
        (
          // prettier-ignore
          { catalogItemsAutoBuyerAssets, catalogItemsAutoBuyerEnabled, catalogItemsAutoBuyerNotification }: Storage
        ) => {
          if (
            catalogItemsAutoBuyerAssets &&
            catalogItemsAutoBuyerEnabled &&
            Date.now() >= new Date(catalogItemsAutoBuyerAssets[0][1].alertISODate).getTime()
          ) {
            robloxService.getXCsrfToken().then((xcsrftoken) => {
              robloxService
                .purchaseProduct(
                  catalogItemsAutoBuyerAssets[0][0],
                  new ProductPurchaseDTO(
                    0,
                    0,
                    catalogItemsAutoBuyerAssets[0][1].data.creatorTargetId
                  ),
                  xcsrftoken
                )
                .then(({ purchased }) => {
                  if (purchased && catalogItemsAutoBuyerNotification) {
                    Browser.notifications.create({
                      message: catalogItemsAutoBuyerAssets[0][1].data.description,
                      title: catalogItemsAutoBuyerAssets[0][1].data.name,
                      iconUrl: '../icon.png',
                      type: 'basic',
                      isClickable: true,
                      contextMessage: CatalogItemsLink.parseCatalogDetails(
                        catalogItemsAutoBuyerAssets[0][1].data
                      )
                    });
                  }
                });

              Browser.storage.local.set({
                catalogItemsAutoBuyerAssets: catalogItemsAutoBuyerAssets.filter(
                  ([id]) => id != catalogItemsAutoBuyerAssets[0][0]
                )
              });
            });
          }
        }
      );
  }
}
