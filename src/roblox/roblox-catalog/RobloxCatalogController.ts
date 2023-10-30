import BrowserStorage from "../../BrowserStorage";
import ImageBatchQueryParamDTO from "../roblox-image-batch/ImageBatchQueryParamDTO";
import RobloxImageBatchService from "../roblox-image-batch/RobloxImageBatchService";
import RobloxUserService from "../roblox-user/RobloxUserService";
import CatalogItemsDetailsQueryParamDTO from "./CatalogItemsDetailsQueryParamDTO";
import RobloxCatalogService from "./RobloxCatalogService";

export default class RobloxCatalogController {
	#robloxCatalogService: RobloxCatalogService;
	#robloxUserService: RobloxUserService;
	#robloxImageBatchService: RobloxImageBatchService;
	#inGameUgcUrl = /\/games\/(\d+)/;

	constructor(
		robloxCatalogService: RobloxCatalogService,
		robloxUserService: RobloxUserService,
		robloxImageBatchService: RobloxImageBatchService,
	) {
		this.#robloxCatalogService = robloxCatalogService;
		this.#robloxUserService = robloxUserService;
		this.#robloxImageBatchService = robloxImageBatchService;
	}

	async findManyFreeCatalogItemsDetails(
		robloxUserId: number,
		catalogItemsDetailsOwnedId: Record<number, boolean>,
	) {
		const catalogItemsDetails = await this.catalogItemsDetailsWithoutOwnedIds(
			robloxUserId,
			catalogItemsDetailsOwnedId,
			(
				await Promise.all([
					this.#robloxCatalogService.findManyCatalogItemsDetails(
						new CatalogItemsDetailsQueryParamDTO(4, 1, 6, 120, 0, 0, 5, 3, "", 66),
					),
					this.#robloxCatalogService.findManyCatalogItemsDetails(
						new CatalogItemsDetailsQueryParamDTO(
							1,
							1,
							3,
							120,
							0,
							0,
							5,
							3,
							"Roblox",
							0,
						),
					),
				])
			)
				.reduce((p, c) => p.concat(c), [])
				.filter(({ id }, i, a) => i === a.findIndex(({ id: id2 }) => id === id2))
				.filter(({ priceStatus }) => priceStatus === "Free"),
		);

		catalogItemsDetails.catalogItemsDetails =
			await this.catalogItemsDetailsWithImageBatchOrderByDescId(
				catalogItemsDetails.catalogItemsDetails,
			);

		return catalogItemsDetails;
	}

	async findManyInGameUgcCatalogItemsDetails() {
		return this.catalogItemsDetailsWithImageBatchOrderByDescId(
			(
				await this.#robloxCatalogService.findManyCatalogItemsDetails(
					new CatalogItemsDetailsQueryParamDTO(1, 2, 3, 120, 0, 0, 5, 3, "", 0),
				)
			)
				.filter(
					({ saleLocationType, unitsAvailableForConsumption }) =>
						saleLocationType === "ExperiencesDevApiOnly" &&
						unitsAvailableForConsumption > 1,
				)
				.map((data) => ({
					...data,
					gameURL: this.#inGameUgcUrl.test(data.description)
						? "https://www.roblox.com/games/" +
						  data.description.split(this.#inGameUgcUrl)[1]
						: null,
				})),
		);
	}

	async catalogItemsDetailsWithImageBatchOrderByDescId(
		catalogItemsDetails: BrowserStorage.CatalogItemsDetails[],
	) {
		const imagesBatches = (
			await this.#robloxImageBatchService.findManyImagesBatches(
				catalogItemsDetails.map(
					({ id, itemType }) => new ImageBatchQueryParamDTO(id, itemType),
				),
			)
		).sort(({ targetId: asc }, { targetId: desc }) => desc - asc);

		return catalogItemsDetails
			.sort(({ id: asc }, { id: desc }) => desc - asc)
			.map((data, i) => ({
				...data,
				imageBatch: imagesBatches[i],
			}));
	}

	async catalogItemsDetailsWithoutOwnedIds(
		robloxUserId: number,
		catalogItemsDetailsOwnedId: Record<number, boolean>,
		catalogItemsDetails: BrowserStorage.CatalogItemsDetails[],
	) {
		const isItemOwnedByUser = await Promise.all(
			catalogItemsDetails
				.filter(({ id }) => !catalogItemsDetailsOwnedId[id])
				.map(({ itemType, id }) =>
					this.#robloxUserService.isItemOwnedByUser(robloxUserId, itemType, id),
				),
		);

		isItemOwnedByUser.forEach(({ itemTargetId: id, owned }) => {
			if (!(id in catalogItemsDetailsOwnedId)) {
				catalogItemsDetailsOwnedId[id] = owned;
			}
		});

		catalogItemsDetails = catalogItemsDetails.filter(
			({ id }) => !catalogItemsDetailsOwnedId[id],
		);

		return { catalogItemsDetails, catalogItemsDetailsOwnedId };
	}
}
