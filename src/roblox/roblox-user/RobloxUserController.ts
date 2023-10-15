import Browser from "webextension-polyfill";
import BrowserStorage from "../../BrowserStorage";
import RobloxUserService from "./RobloxUserService";

export default class RobloxUserController {
	#robloxUserService: RobloxUserService;

	constructor(robloxUserService: RobloxUserService) {
		this.#robloxUserService = robloxUserService;
	}

	async setUserAuthenticationStorage(_storage?: BrowserStorage) {
		// @ts-ignore
		let storage: BrowserStorage = _storage
			? _storage
			: await Browser.storage.local.get(null);

		const robloxUser = await this.#robloxUserService.getAuthenticatedUser();

		if (robloxUser?.id) {
			const avatarHeadshot = await this.#robloxUserService.avatarHeadshot(
				robloxUser.id,
				720,
			);

			storage =
				storage.robloxUser?.id != robloxUser.id
					? BrowserStorage.INITIAL_STORAGE
					: storage;
			storage.avatarHeadshot = avatarHeadshot;
			storage.robloxUser = robloxUser;
		} else {
			storage.robloxUser = null;
		}

		Browser.storage.local.set(storage);
		return storage;
	}
}
