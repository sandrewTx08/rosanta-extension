import Browser from "webextension-polyfill";
import ProductPurchaseDTO from "../roblox/ProductPurchaseDTO";
import BrowserStorage from "../BrowserStorage";
import { robloxCatalogService, robloxTokenService } from "../roblox";
import CatalogItemsLink from "../roblox/CatalogItemsLink";
import AlarmToggleTypes from "./AlarmToggleTypes";
import AlarmToggle from "./AlarmToggle";

export default class RobloxFreeAutoBuyerAlarmToggle extends AlarmToggle {
	constructor(public purchasesMultiplier: number = 2) {
		super(AlarmToggleTypes.catalogItemsAutoBuyerEnabled, 1);
	}

	override async onCreate() {
		// @ts-ignore
		const storage: BrowserStorage = await Browser.storage.local.get(null);

		const catalogItemsAutoBuyerAssets =
			await robloxCatalogService.findManyFreeItemsAssetDetails(
				storage.catalogItemsAutoBuyerTotalPages,
				storage.catalogItemsAutoBuyerLimit,
			);

		return Browser.storage.local.set({
			catalogItemsAutoBuyerAssetsTotal: catalogItemsAutoBuyerAssets.length,
			catalogItemsAutoBuyerAssets,
		} as BrowserStorage);
	}

	override async onAlarm() {
		// @ts-ignore
		const storage: BrowserStorage = await Browser.storage.local.get(null);

		await this.purchaseItems(storage);

		if (storage.catalogItemsAutoBuyerAssets.length <= this.purchasesMultiplier) {
			this.onCreate();
		}
	}

	async purchaseItems(storage: BrowserStorage) {
		const filteredIds: number[] = [];
		const xcsrftoken = await robloxTokenService.getXCsrfToken();

		for (let i = 0; i < this.purchasesMultiplier; i++) {
			// TODO: fix internal error
			try {
				filteredIds.push(storage.catalogItemsAutoBuyerAssets[i].productId);

				const { purchased } = await robloxCatalogService.purchaseProduct(
					storage.catalogItemsAutoBuyerAssets[i].productId,
					new ProductPurchaseDTO(
						0,
						0,
						storage.catalogItemsAutoBuyerAssets[i].creatorTargetId,
					),
					xcsrftoken,
				);

				if (purchased && storage.catalogItemsAutoBuyerNotification) {
					await Browser.notifications.create({
						message: storage.catalogItemsAutoBuyerAssets[i].description,
						title: storage.catalogItemsAutoBuyerAssets[i].name,
						iconUrl: "icon.png",
						type: "basic",
						contextMessage: CatalogItemsLink.parseCatalogDetails(
							storage.catalogItemsAutoBuyerAssets[i],
						),
					});
				}
			} catch (error) {}
		}

		await Browser.storage.local.set({
			catalogItemsAutoBuyerAssets: storage.catalogItemsAutoBuyerAssets.filter(
				(d1) => d1.productId != filteredIds.find((d2) => d2 == d1.productId),
			),
		});
	}
}
