import CatalogItemsDetailsQueryParamDTO from './CatalogItemsDetailsQueryParamDTO';
import CatalogItemsDetailsQueryResponse from './CatalogItemsDetailsQueryResponse';
import ProductPurchaseDTO from './ProductPurchaseDTO';
import PurchasesProductsResponse from './PurchasesProductsResponse';

export default class RobloxRepository {
  getXCsrfTokenByPresence(): Promise<string> {
    return fetch('https://presence.roblox.com/v1/presence/register-app-presence', {
      method: 'POST'
    }).then(
      (response) =>
        response.headers.get('x-csrf-token') || response.headers.get('X-CSRF-TOKEN') || ''
    );
  }

  getAuthenticatedUser() {
    return fetch('https://users.roblox.com/v1/users/authenticated').then((response) =>
      response.json()
    );
  }

  findManyAssetDetails(
    catalogItemDetailsQueryParamDTO: CatalogItemsDetailsQueryParamDTO,
    cursor: string
  ): Promise<CatalogItemsDetailsQueryResponse> {
    return fetch(
      `https://catalog.roblox.com/v2/search/items/details?${new URLSearchParams({
        ...(catalogItemDetailsQueryParamDTO as {}),
        cursor
      }).toString()}`
    ).then((response) => response.json());
  }

  purchaseProduct(
    productId: number,
    productPurchaseDTO: ProductPurchaseDTO,
    xcsrftoken: string
  ): Promise<PurchasesProductsResponse> {
    return fetch(`https://economy.roblox.com/v1/purchases/products/${productId}`, {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': xcsrftoken, 'x-csrf-token': xcsrftoken },
      body: JSON.stringify(productPurchaseDTO)
    }).then((response) => response.json());
  }
}
