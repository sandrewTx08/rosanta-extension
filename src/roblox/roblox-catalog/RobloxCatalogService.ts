import BrowserStorage from "../../BrowserStorage";
import RobloxFreeAutoBuyerAlarm from "../../alarms/RobloxFreeAutoBuyerAlarmToggle";
import CatalogItemsDetailsQueryParamDTO from "../CatalogItemsDetailsQueryParamDTO";
import CatalogItemsDetailsQueryResponse from "../CatalogItemsDetailsQueryResponse";
import ProductPurchaseDTO from "../ProductPurchaseDTO";
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

		data = data.concat(page.data);

		for (let i = 1; i < catalogItemsAutoBuyerTotalPages; i++) {
			if (page?.nextPageCursor && page?.data) {
				page = await this.findOneAssetDetails(
					catalogItemsDetailsQueryParamDTO,
					page.nextPageCursor,
				);

				data = data.concat(page.data);
			}
		}

		return data;
	}

	async findManyUGCLimited() {
		const gameURL = /\/games\/(\d+)/;

		return (
			await this.findManyAssetsDetails(
				new CatalogItemsDetailsQueryParamDTO(1, 1, 3, true, 120, 0, 0, 5, 3),
				10,
			)
		)
			.filter(
				({ saleLocationType }) => saleLocationType == "ExperiencesDevApiOnly",
			)
			.filter(
				({ unitsAvailableForConsumption }) => unitsAvailableForConsumption > 0,
			)
			.filter(({ description }) => description.match(gameURL))
			.sort(({ productId: asc }, { productId: desc }) => desc - asc)
			.map<BrowserStorage["limitedUGCInGameNotifierAssets"][0]>((data) => ({
				...data,
				imageBatch: {},
				gameURL:
					"https://www.roblox.com/games/" + data.description.split(gameURL)[1],
			}));
	}

	async findManyFreeItemsAssetDetails(
		catalogItemsAutoBuyerTotalPages = RobloxFreeAutoBuyerAlarm.INITIAL_STORAGE
			.catalogItemsAutoBuyerTotalPages,
		catalogItemsAutoBuyerLimit = RobloxFreeAutoBuyerAlarm.INITIAL_STORAGE
			.catalogItemsAutoBuyerLimit,
	) {
		return (
			await this.findManyAssetsDetails(
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
			)
		)
			.filter(({ priceStatus }) => priceStatus == "Free")
			.sort(({ productId: asc }, { productId: desc }) => desc - asc);
	}
}
