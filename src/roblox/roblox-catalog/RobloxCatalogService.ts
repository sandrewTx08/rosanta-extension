import RobloxSchedulerBackground from '../../background/RobloxSchedulerBackground';
import CatalogItemsDetailsQueryParamDTO from '../CatalogItemsDetailsQueryParamDTO';
import CatalogItemsDetailsQueryResponse from '../CatalogItemsDetailsQueryResponse';
import ProductPurchaseDTO from '../ProductPurchaseDTO';
import RobloxCatalogRepository from './RobloxCatalogRepository';

export default class RobloxCatalogService {
  #robloxCatalogRepository: RobloxCatalogRepository;

  constructor(robloxRepository: RobloxCatalogRepository) {
    this.#robloxCatalogRepository = robloxRepository;
  }

  findOneFreeItemAssetDetails(
    nextPageCursor: string = '',
    catalogItemsAutoBuyerLimit: CatalogItemsDetailsQueryParamDTO['limit'] = 10
  ) {
    return this.#robloxCatalogRepository.findManyAssetDetails(
      new CatalogItemsDetailsQueryParamDTO(1, 1, 3, true, catalogItemsAutoBuyerLimit, 0, 0, 5, 3),
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
      catalogItemsAutoBuyerLimit as CatalogItemsDetailsQueryParamDTO['limit']
    );

    if (c?.nextPageCursor) {
      for (const p of c.data) {
        d.push(p);
      }
    }

    if (catalogItemsAutoBuyerTotalPages > 1) {
      for (let i = 0; i < catalogItemsAutoBuyerTotalPages; i++) {
        if (c?.nextPageCursor) {
          c = await this.findOneFreeItemAssetDetails(
            c.nextPageCursor,
            catalogItemsAutoBuyerLimit as CatalogItemsDetailsQueryParamDTO['limit']
          );

          for (const p of c.data) {
            d.push(p);
          }
        }
      }
    }

    return Promise.all(
      d
        .filter(({ priceStatus }) => priceStatus == 'Free')
        .sort(({ productId: asc }, { productId: desc }) => desc - asc)
    );
  }

  purchaseProduct(productId: number, purchaseProductDTO: ProductPurchaseDTO, xcsrftoken: string) {
    return this.#robloxCatalogRepository.purchaseProduct(productId, purchaseProductDTO, xcsrftoken);
  }
}
