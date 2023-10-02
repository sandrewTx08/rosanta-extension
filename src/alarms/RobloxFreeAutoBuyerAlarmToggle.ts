import Browser from "webextension-polyfill";
import BrowserStorage from "../BrowserStorage";
import {
	robloxCatalogService,
	robloxTokenService,
	robloxUserService,
} from "../roblox";
import AlarmToggleTypes from "./AlarmToggleTypes";
import AlarmToggle from "./AlarmToggle";
import CatalogItemsLink from "../roblox/roblox-catalog/CatalogItemsLink";
import ProductPurchaseDTO from "../roblox/roblox-catalog/ProductPurchaseDTO";

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

		if (storage.robloxUser?.id) {
			const xcsrftoken = await robloxTokenService.getXCsrfToken();
			await this.purchaseItems(xcsrftoken, storage);

			if (storage.catalogItemsAutoBuyerAssets.length <= this.purchasesMultiplier) {
				this.onCreate();
			}
		}
	}

	async purchaseItems(xcsrftoken: string, storage: BrowserStorage) {
		const filteredIds: number[] = [];

		for (let i = 0; i < this.purchasesMultiplier; i++) {
			try {
				filteredIds.push(storage.catalogItemsAutoBuyerAssets[i].productId);
			} catch (error) {
				break;
			}

			let isItemOwned: boolean;

			try {
				isItemOwned = await robloxUserService.isItemOwnedByUser(
					storage.robloxUser?.id as number,
					storage.catalogItemsAutoBuyerAssets[i].itemType,
					storage.catalogItemsAutoBuyerAssets[i].id,
				);
			} catch (error) {
				isItemOwned = false;
			}

			if (!isItemOwned) {
				const { purchased } = await robloxCatalogService.purchaseProduct(
					storage.catalogItemsAutoBuyerAssets[i].productId,
					new ProductPurchaseDTO(
						0,
						0,
						storage.catalogItemsAutoBuyerAssets[i].creatorTargetId,
					),
					xcsrftoken,
				);

				if (purchased) {
					if (storage.catalogItemsAutoBuyerNotification) {
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
				}
			}
		}

		await Browser.storage.local.set({
			catalogItemsAutoBuyerAssets: storage.catalogItemsAutoBuyerAssets.filter(
				(id1) => id1.productId != filteredIds.find((id2) => id2 == id1.productId),
			),
		});
	}
}
