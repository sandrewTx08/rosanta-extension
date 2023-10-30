import CatalogItemsDetailsQueryParamDTO from "./CatalogItemsDetailsQueryParamDTO";
import CatalogItemsDetailsResponse from "./CatalogItemsDetailsResponse";
import ProductPurchaseDTO from "./ProductPurchaseDTO";
import PurchaseProductsResponse from "./PurchaseProductsResponse";

export default class RobloxCatalogRepository {
	findManyAssetDetails(
		catalogItemDetailsQueryParamDTO: CatalogItemsDetailsQueryParamDTO,
		cursor: string,
	): Promise<CatalogItemsDetailsResponse> {
		return fetch(
			`https://catalog.roblox.com/v2/search/items/details?${new URLSearchParams({
				...(catalogItemDetailsQueryParamDTO as {}),
				cursor,
			}).toString()}`,
		).then((response) => response.json());
	}

	purchaseProduct(
		productId: number,
		productPurchaseDTO: ProductPurchaseDTO,
		xcsrftoken: string,
	): Promise<PurchaseProductsResponse> {
		return fetch(
			`https://economy.roblox.com/v1/purchases/products/${productId}`,
			{
				method: "POST",
				headers: { "X-CSRF-TOKEN": xcsrftoken },
				body: JSON.stringify(productPurchaseDTO),
			},
		).then((response) => response.json());
	}
}
