import CatalogItemsDetailsQueryResponse from "../roblox-catalog/CatalogItemsDetailsQueryResponse";
import RobloxUserRepository from "./RobloxUserRespository";

export default class RobloxUserService {
	#robloxUserRepository: RobloxUserRepository;

	constructor(robloxUserRepository: RobloxUserRepository) {
		this.#robloxUserRepository = robloxUserRepository;
	}

	getAuthenticatedUser() {
		return this.#robloxUserRepository.getAuthenticatedUser();
	}

	async isItemOwnedByUser(
		userId: number,
		itemType: CatalogItemsDetailsQueryResponse["data"][0]["itemType"],
		itemTargetId: number,
	) {
		let it: number;

		switch (itemType) {
			case "Bundle": {
				it = 3;
				break;
			}

			default:
			case "Asset": {
				it = 0;
			}
		}

		return (
			(await this.#robloxUserRepository.isItemOwnedByUser(
				userId,
				it,
				itemTargetId,
			)) === true
		);
	}

	avatarHeadshot(userIds: number, size: number) {
		return this.#robloxUserRepository.avatarHeadshot(
			userIds,
			`${size}x${size}`,
			false,
			"Png",
		);
	}
}
