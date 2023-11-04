import Browser from "webextension-polyfill";
import { robloxCatalogController } from "../roblox";
import AlarmToggle from "./AlarmToggle";
import AlarmToggleTypes from "./AlarmToggleType";
import BrowserStorage from "../BrowserStorage";
import CatalogItemsLink from "../roblox/roblox-catalog/CatalogItemsLink";

export default class InGameUgcNotifierAlarmToggle extends AlarmToggle {
	constructor() {
		super(AlarmToggleTypes.ugcInGameNotifierEnabled, 1, 0);
	}

	override async onCreate() {
		Browser.storage.local.set({
			ugcInGameNotifier:
				await robloxCatalogController.findManyInGameUgcCatalogItemsDetails(),
		} as BrowserStorage);
	}

	override async onAlarm() {
		// @ts-ignore
		const storage: BrowserStorage = await Browser.storage.local.get(null);

		const inGameUgcCatalogItemsDetails =
			await robloxCatalogController.findManyInGameUgcCatalogItemsDetails();

		if (
			storage.ugcInGameNotifier[0].id !== inGameUgcCatalogItemsDetails[0].id &&
			storage.ugcInGameNotifier[1].id === inGameUgcCatalogItemsDetails[1].id
		) {
			await Browser.notifications.create({
				message: "New UGC is now available",
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
			ugcInGameNotifier: inGameUgcCatalogItemsDetails,
		} as BrowserStorage);
	}
}
