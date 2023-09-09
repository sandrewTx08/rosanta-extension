import Browser from 'webextension-polyfill';
import ProductPurchaseDTO from './ProductPurchaseDTO';
import RobloxService from './RobloxService';

export default class RobloxController {
  #robloxService;

  purchasesTimeout = 60_000;
  assets: Map<
    number,
    {
      timer: ReturnType<typeof setTimeout>;
      purchased: boolean;
      nextBuy: string;
      data: any;
    }
  > = new Map();

  constructor(robloxService: RobloxService) {
    this.#robloxService = robloxService;
  }

  stop() {
    return Array.from(this.assets).map(([p_id, p_d]) => {
      clearTimeout(p_d.timer);
      this.assets.delete(p_id);
    });
  }

  setInitialCatalog() {
    return this.#robloxService.findManyFreeItemsAssetDetails().then(({ data }) => {
      Browser.storage.local.set({
        catalogAssetDetails: data.map((d: any) => [d.productId, { data: d }])
      });
    });
  }

  async startPurchaseManyAssets() {
    const catalogAssetDetails = await this.#robloxService.findManyFreeItemsAssetDetails();

    for (let i = 0; i < catalogAssetDetails.data.length; i++) {
      const aww = this.purchasesTimeout * i;

      this.assets.set(catalogAssetDetails.data[i].productId, {
        data: catalogAssetDetails.data[i],
        purchased: false,
        nextBuy: new Date(Date.now() + aww).toISOString(),
        timer: setTimeout(() => {
          this.#robloxService.purchaseProduct(
            catalogAssetDetails.data[i].productId,
            new ProductPurchaseDTO(0, 0, catalogAssetDetails.data[i].creatorTargetId)
          );
        }, aww)
      });
    }

    Browser.storage.local.set({ catalogAssetDetails: Array.from(this.assets) });
    return Array.from(this.assets);
  }
}
