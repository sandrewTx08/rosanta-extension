import Browser from "webextension-polyfill";
import { robloxCatalogService } from "../roblox";
import AlarmToggle from "./AlarmToggle";
import AlarmToggleTypes from "./AlarmToggleTypes";
import BrowserStorage from "../BrowserStorage";
import CatalogItemsLink from "../roblox/roblox-catalog/CatalogItemsLink";

export default class LimitedUGCInGameNotifierAlarmToggle extends AlarmToggle {
	constructor() {
		super(AlarmToggleTypes.limitedUGCInGameNotifierEnabled, 1);
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
				message: "New limited UGC is now available",
				title: limitedUGCInGameNotifierAssets[0].name,
				iconUrl:
					limitedUGCInGameNotifierAssets[0].imageBatch?.imageUrl || "icon.png",
				type: "basic",
				contextMessage: CatalogItemsLink.parseCatalogDetails(
					limitedUGCInGameNotifierAssets[0],
				),
				appIconMaskUrl: "icon.png",
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
