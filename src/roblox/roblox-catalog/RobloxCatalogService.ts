import CatalogItemsDetailsQueryParamDTO from "./CatalogItemsDetailsQueryParamDTO";
import CatalogItemsDetailsResponse from "./CatalogItemsDetailsResponse";
import ProductPurchaseDTO from "./ProductPurchaseDTO";
import RobloxCatalogRepository from "./RobloxCatalogRepository";

export default class RobloxCatalogService {
	#robloxCatalogRepository: RobloxCatalogRepository;

	constructor(robloxRepository: RobloxCatalogRepository) {
		this.#robloxCatalogRepository = robloxRepository;
	}

	purchaseProduct(
		productId: number,
		purchaseProductDTO: ProductPurchaseDTO,
		xcsrftoken: string,
	) {
		return this.#robloxCatalogRepository.purchaseProduct(
			productId,
			purchaseProductDTO,
			xcsrftoken,
		);
	}

	findOneCatalogItemsDetails(
		catalogItemsDetailsQueryParamDTO: CatalogItemsDetailsQueryParamDTO,
		nextPageCursor: string = "",
	) {
		return this.#robloxCatalogRepository.findManyAssetDetails(
			catalogItemsDetailsQueryParamDTO,
			nextPageCursor,
		);
	}

	async findManyCatalogItemsDetails(
		catalogItemsDetailsQueryParamDTO: CatalogItemsDetailsQueryParamDTO,
		nextPageCursor: string = "",
		retryCount: number = 0,
		retryLimit: number = 5,
	) {
		let data: CatalogItemsDetailsResponse["data"] = [];

		let page = await this.findOneCatalogItemsDetails(
			catalogItemsDetailsQueryParamDTO,
			nextPageCursor,
		);

		if (page?.data) {
			data = data.concat(page.data);

			while (retryCount < retryLimit) {
				if (page?.nextPageCursor) {
					const page2 = await this.findOneCatalogItemsDetails(
						catalogItemsDetailsQueryParamDTO,
						page.nextPageCursor,
					);

					if (page2?.data) {
						page = page2;
						data = data.concat(page2.data);
					} else {
						++retryCount;
						data = data.concat(
							await this.findManyCatalogItemsDetails(
								catalogItemsDetailsQueryParamDTO,
								page.nextPageCursor,
								retryCount,
							),
						);
						break;
					}
				} else {
					break;
				}
			}
		} else {
			++retryCount;
			data = data.concat(
				await this.findManyCatalogItemsDetails(
					catalogItemsDetailsQueryParamDTO,
					nextPageCursor,
					retryCount,
				),
			);
		}

		return data;
	}
}
