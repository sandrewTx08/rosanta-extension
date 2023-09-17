import RobloxSchedulerBackground from '../background/RobloxSchedulerBackground';
import CatalogItemsDetailsQueryParamDTO from './CatalogItemsDetailsQueryParamDTO';
import CatalogItemsDetailsQueryResponse from './CatalogItemsDetailsQueryResponse';
import ProductPurchaseDTO from './ProductPurchaseDTO';
import RobloxRepository from './RobloxRepository';

export default class RobloxService {
  #robloxRepository: RobloxRepository;

  constructor(robloxRepository: RobloxRepository) {
    this.#robloxRepository = robloxRepository;
  }

  getXCsrfToken() {
    return this.#robloxRepository.getXCsrfTokenByPresence();
  }

  findOneFreeItemAssetDetails(
    nextPageCursor: string = '',
    catalogItemsAutoBuyerLimit: CatalogItemsDetailsQueryParamDTO['Limit'] = 10
  ) {
    return this.#robloxRepository.findManyAssetDetails(
      new CatalogItemsDetailsQueryParamDTO(1, 1, 2, true, catalogItemsAutoBuyerLimit, 0, 0, 1, 3),
      nextPageCursor
    );
  }

  async findManyFreeItemsAssetDetails(
    catalogItemsAutoBuyerTotalPages = RobloxSchedulerBackground.INITIAL_STORAGE
      .catalogItemsAutoBuyerTotalPages,
    catalogItemsAutoBuyerLimit = RobloxSchedulerBackground.INITIAL_STORAGE
      .catalogItemsAutoBuyerLimit
  ) {
    const d: CatalogItemsDetailsQueryResponse['data'] = [];

    let c = await this.findOneFreeItemAssetDetails(
      '',
      catalogItemsAutoBuyerLimit as CatalogItemsDetailsQueryParamDTO['Limit']
    );

    if (catalogItemsAutoBuyerTotalPages > 1) {
      for (let i = 0; i < catalogItemsAutoBuyerTotalPages; i++) {
        if (('nextPageCursor' as keyof typeof c) in c && c.nextPageCursor) {
          c = await this.findOneFreeItemAssetDetails(
            c.nextPageCursor,
            catalogItemsAutoBuyerLimit as CatalogItemsDetailsQueryParamDTO['Limit']
          );

          for (const p of c.data) {
            d.push(p);
          }
        }
      }
    } else {
      if (('nextPageCursor' as keyof typeof c) in c && c.nextPageCursor) {
        for (const p of c.data) {
          d.push(p);
        }
      }
    }

    return Promise.all(
      d
        .filter(({ price }) => price == 0)
        .sort(({ productId: asc }, { productId: desc }) => desc - asc)
    );
  }

  purchaseProduct(productId: number, purchaseProductDTO: ProductPurchaseDTO, xcsrftoken: string) {
    return this.#robloxRepository.purchaseProduct(productId, purchaseProductDTO, xcsrftoken);
  }
}
