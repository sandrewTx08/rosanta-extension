import CatalogItemsDetailsQueryParamDTO from './CatalogItemsDetailsQueryParamDTO';
import ProductPurchaseDTO from './ProductPurchaseDTO';
import RobloxRepository from './RobloxRepository';

export default class RobloxService {
  #robloxRepository: RobloxRepository;

  constructor(robloxRepository: RobloxRepository) {
    this.#robloxRepository = robloxRepository;
  }

  findManyFreeItemsAssetDetails() {
    return this.#robloxRepository
      .findManyAssetDetails(new CatalogItemsDetailsQueryParamDTO(1, 1, 2, false, 120, 0, 0, 1, 3))
      .then(({ data }) => data);
  }

  purchaseProduct(productId: number, purchaseProductDTO: ProductPurchaseDTO) {
    return this.#robloxRepository.purchaseProduct(productId, purchaseProductDTO);
  }
}
