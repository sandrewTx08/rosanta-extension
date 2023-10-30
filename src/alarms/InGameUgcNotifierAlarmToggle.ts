import Browser from "webextension-polyfill";
import { robloxCatalogController } from "../roblox";
import AlarmToggle from "./AlarmToggle";
import AlarmToggleTypes from "./AlarmToggleType";
import BrowserStorage from "../BrowserStorage";
import CatalogItemsLink from "../roblox/roblox-catalog/CatalogItemsLink";

export default class InGameUgcNotifierAlarmToggle extends AlarmToggle {
	constructor() {
		super(AlarmToggleTypes.limitedUgcInGameNotifierEnabled, 1, 0);
	}

	override async onCreate() {
		Browser.storage.local.set({
			limitedUgcInGameNotifier:
				await robloxCatalogController.findManyInGameUgcCatalogItemsDetails(),
		} as BrowserStorage);
	}

	override async onAlarm() {
		// @ts-ignore
		const storage: BrowserStorage = await Browser.storage.local.get(null);

		const inGameUgcCatalogItemsDetails =
			await robloxCatalogController.findManyInGameUgcCatalogItemsDetails();

		if (
			storage.limitedUgcInGameNotifier[0].name !==
			inGameUgcCatalogItemsDetails[0].name
		) {
			await Browser.notifications.create({
				message: "New limited UGC is now available",
				title: inGameUgcCatalogItemsDetails[0].name,
				iconUrl: inGameUgcCatalogItemsDetails[0].imageBatch?.imageUrl || "icon.png",
				type: "basic",
				contextMessage: CatalogItemsLink.parseCatalogDetails(
					inGameUgcCatalogItemsDetails[0],
				),
				appIconMaskUrl: "icon.png",
			});
		}

		await Browser.storage.local.set({
			limitedUgcInGameNotifier: inGameUgcCatalogItemsDetails,
		} as BrowserStorage);
	}
}
