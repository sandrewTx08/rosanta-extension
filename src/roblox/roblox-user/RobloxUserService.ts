import RobloxUserRepository from "./RobloxUserRespository";

export default class RobloxUserService {
	#robloxUserRepository: RobloxUserRepository;

	constructor(robloxUserRepository: RobloxUserRepository) {
		this.#robloxUserRepository = robloxUserRepository;
	}

	getAuthenticatedUser() {
		return this.#robloxUserRepository.getAuthenticatedUser();
	}

	async isItemOwndByUser(
		userId: number,
		itemType: number,
		itemTargetId: number,
	) {
		return (
			(await this.#robloxUserRepository.isItemOwndByUser(
				userId,
				itemType,
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
