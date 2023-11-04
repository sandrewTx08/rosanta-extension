import Alarm from "./Alarm";
import AlarmType from "./AlarmType";
import { robloxUserController } from "../roblox";
import Browser from "webextension-polyfill";
import BrowserStorage from "../BrowserStorage";

export default class UserAuthenticationAlarm extends Alarm {
	constructor() {
		super(AlarmType.userAuthenticationAlarm, 1, 0);
		this.createAlarm();
	}

	override async onAlarm() {
		const storage = await robloxUserController.getUserAuthenticationStorage();

		Browser.storage.local.set({
			robloxUser: storage.robloxUser,
			avatarHeadshot: storage.avatarHeadshot,
			autoBuyerCatalogItemsDetailsEnabled:
				storage.autoBuyerCatalogItemsDetailsEnabled === null ||
				storage.autoBuyerCatalogItemsDetailsEnabled,
		} as BrowserStorage);
	}
}
