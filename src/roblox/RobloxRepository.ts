import axios from 'axios';
import CatalogItemsDetailsQueryParamDTO from './CatalogItemsDetailsQueryParamDTO';
import ProductPurchaseDTO from './ProductPurchaseDTO';

export default class RobloxRepository {
  getXCsrfTokenByPresence() {
    return axios.post('https://presence.roblox.com/v1/presence/register-app-presence');
  }

  getAuthenticatedUser() {
    return axios('https://users.roblox.com/v1/users/authenticated');
  }

  findManyAssetDetails(catalogItemDetailsQueryParamDTO: CatalogItemsDetailsQueryParamDTO) {
    return axios('https://catalog.roblox.com/v2/search/items/details', {
      params: catalogItemDetailsQueryParamDTO
    });
  }

  purchaseProduct(productId: number, productPurchaseDTO: ProductPurchaseDTO) {
    return axios.post(
      `https://economy.roblox.com/v1/purchases/products/${productId}`,
      productPurchaseDTO
    );
  }
}
