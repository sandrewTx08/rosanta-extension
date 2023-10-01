import Browser from "webextension-polyfill";
import { robloxCatalogService } from "../roblox";
import AlarmToggle from "./AlarmToggle";
import AlarmToggleTypes from "./AlarmToggleTypes";
import BrowserStorage from "../BrowserStorage";

export default class LimitedUGCInGameNotifierAlarmToggle extends AlarmToggle {
	constructor() {
		super(AlarmToggleTypes.limitedUGCInGameNotifierEnabled, 5);
	}

	override async onAlarm() {
		// @ts-ignore
		const storage: BrowserStorage = await Browser.storage.local.get(null);
		const limitedUGCInGameNotifierAssets =
			await robloxCatalogService.findManyUGCLimited();

		if (
			storage.limitedUGCInGameNotifierAssets[0].name !==
			limitedUGCInGameNotifierAssets[0].name
		) {
			await Browser.notifications.create({
				message: limitedUGCInGameNotifierAssets[0].name,
				title: "New limited UGC is now available in game",
				iconUrl: "icon.png",
				type: "basic",
			});
		}

		await Browser.storage.local.set({
			limitedUGCInGameNotifierAssets,
		} as BrowserStorage);
	}

	override async onCreate() {
		Browser.storage.local.set({
			limitedUGCInGameNotifierAssets:
				await robloxCatalogService.findManyUGCLimited(),
		} as BrowserStorage);
	}
}
