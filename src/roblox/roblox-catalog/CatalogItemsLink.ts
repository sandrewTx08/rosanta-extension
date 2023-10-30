import CatalogItemsDetailsResponse from "./CatalogItemsDetailsResponse";

export default class CatalogItemsLink {
	static parse(
		itemType: CatalogItemsDetailsResponse["data"][0]["itemType"],
		id: number,
	): string {
		switch (itemType) {
			case "Bundle":
				return `https://www.roblox.com/bundles/${id}`;

			default:
			case "Asset":
				return `https://www.roblox.com/catalog/${id}`;
		}
	}

	static parseCatalogDetails(
		catalogDetails: CatalogItemsDetailsResponse["data"][0],
	): string {
		return CatalogItemsLink.parse(
			catalogDetails.itemType,
			catalogDetails.itemType == "Bundle" ||
				(catalogDetails?.productId && catalogDetails.id > catalogDetails.productId)
				? catalogDetails.id
				: catalogDetails?.productId || catalogDetails.id,
		);
	}
}
