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
		nextPageCursor: string = "",
	) {
		let data: CatalogItemsDetailsQueryResponse["data"] = [];

		let page = await this.findOneAssetDetails(
			catalogItemsDetailsQueryParamDTO,
			nextPageCursor,
		);

		if (page?.data) {
			data = data.concat(page.data);

			for (let i = 1; i < catalogItemsAutoBuyerTotalPages; i++) {
				if (page?.nextPageCursor) {
					const page2 = await this.findOneAssetDetails(
						catalogItemsDetailsQueryParamDTO,
						page.nextPageCursor,
					);

					if (page2?.data) {
						page = page2;
						data = data.concat(page2.data);
					} else {
						data = data.concat(
							await this.findManyAssetsDetails(
								catalogItemsDetailsQueryParamDTO,
								catalogItemsAutoBuyerTotalPages,
								page.nextPageCursor,
							),
						);
						break;
					}
				} else {
					break;
				}
			}
		} else {
			data = data.concat(
				await this.findManyAssetsDetails(
					catalogItemsDetailsQueryParamDTO,
					catalogItemsAutoBuyerTotalPages,
					nextPageCursor,
				),
			);
		}

		return data;
	}

	async findManyUGCLimited(): Promise<
		BrowserStorage["catalogItemsAutoBuyerAssets"]
	> {
		const gameURL = /\/games\/(\d+)/;

		let catalogItemsDetails = await this.findManyAssetsDetails(
			new CatalogItemsDetailsQueryParamDTO(1, 1, 3, true, 120, 0, 0, 5, 3, ""),
			10,
		);

		catalogItemsDetails = catalogItemsDetails
			.filter(
				({ saleLocationType, unitsAvailableForConsumption, description }) =>
					description.match(gameURL) &&
					saleLocationType == "ExperiencesDevApiOnly" &&
					unitsAvailableForConsumption > 1,
			)
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
		filteredIds: { [id: number]: boolean },
	): Promise<[BrowserStorage["catalogItemsAutoBuyerAssets"], number[]]> {
		let catalogItemsDetails: BrowserStorage["catalogItemsAutoBuyerAssets"] = [];

		const [p1, p2] = await Promise.all([
			this.findManyAssetsDetails(
				new CatalogItemsDetailsQueryParamDTO(1, 1, 3, true, 120, 0, 0, 5, 3, ""),
				12,
			),
			this.findManyAssetsDetails(
				new CatalogItemsDetailsQueryParamDTO(
					1,
					1,
					3,
					true,
					120,
					0,
					0,
					5,
					3,
					"Roblox",
				),
				12,
			),
		]);

		catalogItemsDetails = catalogItemsDetails
			.concat(p1, p2)
			.filter(({ priceStatus, id }) => priceStatus == "Free" && !filteredIds[id]);

		let catalogItemsDetailsIds = catalogItemsDetails.map(({ id }) => id);

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

		catalogItemsDetailsIds = catalogItemsDetailsIds.filter(
			(_, i) => isItemOwnedByUser[i],
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

		return [catalogItemsDetails, catalogItemsDetailsIds];
	}
}
