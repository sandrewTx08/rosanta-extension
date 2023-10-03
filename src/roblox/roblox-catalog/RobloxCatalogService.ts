import BrowserStorage from "../../BrowserStorage";
import ImageBatchQueryParamDTO from "../roblox-image-batch/ImageBatchQueryParamDTO";
import RobloxImageBatchService from "../roblox-image-batch/RobloxImageBatchService";
import RobloxUserService from "../roblox-user/RobloxUserService";
import CatalogItemsDetailsQueryParamDTO from "./CatalogItemsDetailsQueryParamDTO";
import CatalogItemsDetailsQueryResponse from "./CatalogItemsDetailsQueryResponse";
import ProductPurchaseDTO from "./ProductPurchaseDTO";
import RobloxCatalogRepository from "./RobloxCatalogRepository";

export default class RobloxCatalogService {
	#robloxCatalogRepository: RobloxCatalogRepository;
	#robloxImageBatchService: RobloxImageBatchService;
	#robloxUserService: RobloxUserService;

	constructor(
		robloxRepository: RobloxCatalogRepository,
		robloxImageBatchService: RobloxImageBatchService,
		robloxUserService: RobloxUserService,
	) {
		this.#robloxCatalogRepository = robloxRepository;
		this.#robloxImageBatchService = robloxImageBatchService;
		this.#robloxUserService = robloxUserService;
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
		robloxUserId: number,
	): Promise<BrowserStorage["catalogItemsAutoBuyerAssets"]> {
		let catalogItemsDetails = await this.findManyAssetsDetails(
			new CatalogItemsDetailsQueryParamDTO(1, 1, 3, true, 120, 0, 0, 5, 3),
			12,
		);

		catalogItemsDetails = catalogItemsDetails.filter(
			({ priceStatus }) => priceStatus == "Free",
		);

		const isItemOwnedByUser = await Promise.all(
			catalogItemsDetails.map(
				async (data) =>
					await this.#robloxUserService.isItemOwnedByUser(
						robloxUserId,
						data.itemType,
						data.id,
					),
			),
		);

		catalogItemsDetails = catalogItemsDetails
			.filter((_, i) => !isItemOwnedByUser[i])
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
