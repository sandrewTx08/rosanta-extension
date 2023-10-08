import Browser from "webextension-polyfill";
import BrowserStorage from "../BrowserStorage";
import { robloxCatalogService, robloxTokenService } from "../roblox";
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

		if (storage.robloxUser?.id) {
			const [catalogItemsAutoBuyerAssets, filteredIds] =
				await robloxCatalogService.findManyFreeItemsAssetDetails(
					storage.robloxUser.id,
					storage.catalogItemsAutoBuyerAssetsFiltered,
				);

			for (const id of filteredIds) {
				storage.catalogItemsAutoBuyerAssetsFiltered[id] = true;
			}

			return Browser.storage.local.set({
				catalogItemsAutoBuyerAssetsTotal: catalogItemsAutoBuyerAssets.length,
				catalogItemsAutoBuyerAssets,
				catalogItemsAutoBuyerAssetsFiltered:
					storage.catalogItemsAutoBuyerAssetsFiltered,
			} as BrowserStorage);
		}
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
				const itemURL = CatalogItemsLink.parseCatalogDetails(
					storage.catalogItemsAutoBuyerAssets[i],
				);

				await Browser.notifications.create({
					title: storage.catalogItemsAutoBuyerAssets[i].name,
					message: "Purchased item successfully",
					iconUrl:
						storage.catalogItemsAutoBuyerAssets[i].imageBatch?.imageUrl || "icon.png",
					type: "basic",
					contextMessage: itemURL,
					appIconMaskUrl: "icon.png",
				});
			}
		}

		const catalogItemsAutoBuyerAssets =
			storage.catalogItemsAutoBuyerAssets.filter(
				({ productId }) => productId != filteredIds.find((id) => id == productId),
			);

		for (const { id } of catalogItemsAutoBuyerAssets) {
			storage.catalogItemsAutoBuyerAssetsFiltered[id] = true;
		}

		await Browser.storage.local.set({
			catalogItemsAutoBuyerAssets,
			catalogItemsAutoBuyerAssetsFiltered:
				storage.catalogItemsAutoBuyerAssetsFiltered,
		} as BrowserStorage);
	}
}
