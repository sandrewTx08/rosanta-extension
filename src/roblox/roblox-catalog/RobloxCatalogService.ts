import BrowserStorage from "../../BrowserStorage";
import ImageBatchQueryParamDTO from "../roblox-image-batch/ImageBatchQueryParamDTO";
import RobloxImageBatchService from "../roblox-image-batch/RobloxImageBatchService";
import CatalogItemsDetailsQueryParamDTO from "./CatalogItemsDetailsQueryParamDTO";
import CatalogItemsDetailsQueryResponse from "./CatalogItemsDetailsQueryResponse";
import ProductPurchaseDTO from "./ProductPurchaseDTO";
import RobloxCatalogRepository from "./RobloxCatalogRepository";

export default class RobloxCatalogService {
	#robloxCatalogRepository: RobloxCatalogRepository;
	#robloxImageBatchService: RobloxImageBatchService;

	constructor(
		robloxRepository: RobloxCatalogRepository,
		robloxImageBatchService: RobloxImageBatchService,
	) {
		this.#robloxCatalogRepository = robloxRepository;
		this.#robloxImageBatchService = robloxImageBatchService;
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

	findOneAssetDetails(
		catalogItemsDetailsQueryParamDTO: CatalogItemsDetailsQueryParamDTO,
		nextPageCursor: string = "",
	) {
		return this.#robloxCatalogRepository.findManyAssetDetails(
			catalogItemsDetailsQueryParamDTO,
			nextPageCursor,
		);
	}

	async findManyAssetsDetails(
		catalogItemsDetailsQueryParamDTO: CatalogItemsDetailsQueryParamDTO,
		catalogItemsAutoBuyerTotalPages: number,
	) {
		let data: CatalogItemsDetailsQueryResponse["data"] = [];

		let page = await this.findOneAssetDetails(catalogItemsDetailsQueryParamDTO);

		if (page?.data) {
			data = data.concat(page.data);

			for (let i = 1; i < catalogItemsAutoBuyerTotalPages; i++) {
				if (page?.nextPageCursor) {
					page = await this.findOneAssetDetails(
						catalogItemsDetailsQueryParamDTO,
						page.nextPageCursor,
					);

					if (page?.data) {
						data = data.concat(page.data);
					}
				} else {
					break;
				}
			}
		}

		return data;
	}

	async findManyUGCLimited(): Promise<
		BrowserStorage["catalogItemsAutoBuyerAssets"]
	> {
		const gameURL = /\/games\/(\d+)/;

		let catalogItemsDetails = await this.findManyAssetsDetails(
			new CatalogItemsDetailsQueryParamDTO(1, 1, 3, true, 120, 0, 0, 5, 3),
			10,
		);

		catalogItemsDetails = catalogItemsDetails
			.filter(
				({ saleLocationType }) => saleLocationType == "ExperiencesDevApiOnly",
			)
			.filter(
				({ unitsAvailableForConsumption }) => unitsAvailableForConsumption > 1,
			)
			.filter(({ description }) => description.match(gameURL))
			.sort(({ id: asc }, { id: desc }) => desc - asc);

		const imagesBatches =
			await this.#robloxImageBatchService.findManyImagesBatches(
				catalogItemsDetails.map(
					({ id, itemType }) => new ImageBatchQueryParamDTO(id, itemType),
				),
			);

		catalogItemsDetails = catalogItemsDetails.map<
			BrowserStorage["limitedUGCInGameNotifierAssets"][0]
		>((data, i) => ({
			...data,
			imageBatch: imagesBatches[i],
			gameURL:
				"https://www.roblox.com/games/" + data.description.split(gameURL)[1],
		}));

		return catalogItemsDetails;
	}

	async findManyFreeItemsAssetDetails(
		catalogItemsAutoBuyerTotalPages = BrowserStorage.INITIAL_STORAGE
			.catalogItemsAutoBuyerTotalPages,
		catalogItemsAutoBuyerLimit = BrowserStorage.INITIAL_STORAGE
			.catalogItemsAutoBuyerLimit,
	): Promise<BrowserStorage["catalogItemsAutoBuyerAssets"]> {
		let catalogItemsDetails = await this.findManyAssetsDetails(
			new CatalogItemsDetailsQueryParamDTO(
				1,
				1,
				3,
				true,
				catalogItemsAutoBuyerLimit as CatalogItemsDetailsQueryParamDTO["limit"],
				0,
				0,
				5,
				3,
			),
			catalogItemsAutoBuyerTotalPages,
		);

		catalogItemsDetails = catalogItemsDetails
			.filter(({ priceStatus }) => priceStatus == "Free")
			.sort(({ id: asc }, { id: desc }) => desc - asc);

		const imagesBatches =
			await this.#robloxImageBatchService.findManyImagesBatches(
				catalogItemsDetails.map(
					({ id, itemType }) => new ImageBatchQueryParamDTO(id, itemType),
				),
			);

		catalogItemsDetails = catalogItemsDetails.map((data, i) => ({
			...data,
			imageBatch: imagesBatches[i],
		}));

		return catalogItemsDetails;
	}
}
