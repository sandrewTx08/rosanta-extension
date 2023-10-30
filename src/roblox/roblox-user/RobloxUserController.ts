import Browser from "webextension-polyfill";
import BrowserStorage from "../../BrowserStorage";
import RobloxUserService from "./RobloxUserService";

export default class RobloxUserController {
	#robloxUserService: RobloxUserService;

	constructor(robloxUserService: RobloxUserService) {
		this.#robloxUserService = robloxUserService;
	}

	async getUserAuthenticationStorage() {
		// @ts-ignore
		let storage: BrowserStorage = await Browser.storage.local.get(null);

		const robloxUser = await this.#robloxUserService.getAuthenticatedUser();

		if (robloxUser?.id) {
			if (storage.robloxUser?.id != robloxUser.id) {
				storage = { ...BrowserStorage.INITIAL_STORAGE, robloxUser };

				await Browser.storage.local.set(storage);
			}
		} else {
			storage.robloxUser = null;
		}

		return storage;
	}
}
