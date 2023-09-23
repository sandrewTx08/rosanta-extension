import CatalogItemsDetailsQueryParamDTO from "../CatalogItemsDetailsQueryParamDTO";
import CatalogItemsDetailsQueryResponse from "../CatalogItemsDetailsQueryResponse";
import ProductPurchaseDTO from "../ProductPurchaseDTO";
import PurchasesProductsResponse from "../PurchasesProductsResponse";

export default class RobloxCatalogRepository {
	findManyAssetDetails(
		catalogItemDetailsQueryParamDTO: CatalogItemsDetailsQueryParamDTO,
		cursor: string,
	): Promise<CatalogItemsDetailsQueryResponse> {
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
	): Promise<PurchasesProductsResponse> {
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
