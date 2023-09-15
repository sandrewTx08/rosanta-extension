import Browser from 'webextension-polyfill';
import Roblox from './roblox';
import ProductPurchaseDTO from './roblox/ProductPurchaseDTO';
import AssetsPurchaser from './roblox/AssetsPurchaser';

interface Storage {
  catalogAssetDetails: [number, AssetsPurchaser][];
  enableBot: boolean;
  purchasesNotification: boolean;
  catalogAssetDetailsTotal: number;
}

const PURCHASE_TIMEOUT = 60_000;

setInterval(() => {
  Browser.storage.local
    .get(['catalogAssetDetails', 'enableBot', 'purchasesNotification'])
    // @ts-ignore
    .then(({ catalogAssetDetails, enableBot, purchasesNotification }: Storage) => {
      if (
        catalogAssetDetails &&
        enableBot &&
        Date.now() >= new Date(catalogAssetDetails[0][1].nextBuy).getTime()
      ) {
        Roblox.service.getXCsrfToken().then((xcsrftoken) => {
          Roblox.service
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
}, PURCHASE_TIMEOUT);

Browser.runtime.onInstalled.addListener(() => {
  Browser.storage.local.set({
    enableBot: false,
    catalogAssetDetails: [],
    purchasesNotification: true,
    catalogAssetDetailsTotal: 0
  } as Storage);
});

Browser.storage.local.onChanged.addListener(({ enableBot }) => {
  if (enableBot?.newValue) {
    // @ts-ignore
    Roblox.service.findManyFreeItemsAssetDetails().then((data) => {
      Browser.storage.local.set({
        catalogAssetDetailsTotal: data.length,
        catalogAssetDetails: data.map<[number, AssetsPurchaser]>((data, i) => [
          data.productId,
          new AssetsPurchaser(data, new Date(Date.now() + PURCHASE_TIMEOUT * i).toISOString())
        ])
      });
    });
  }
});
