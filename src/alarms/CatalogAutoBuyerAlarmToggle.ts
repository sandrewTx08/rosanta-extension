import Browser from "webextension-polyfill";
import BrowserStorage from "../BrowserStorage";
import {
	robloxCatalogService,
	robloxTokenService,
	robloxUserController,
} from "../roblox";
import AlarmToggleTypes from "./AlarmToggleTypes";
import AlarmToggle from "./AlarmToggle";
import CatalogItemsLink from "../roblox/roblox-catalog/CatalogItemsLink";
import ProductPurchaseDTO from "../roblox/roblox-catalog/ProductPurchaseDTO";

export default class CatalogAutoBuyerAlarmToggle extends AlarmToggle {
	constructor() {
		super(AlarmToggleTypes.catalogItemsAutoBuyerEnabled, 1);
		this.onCreate();
	}

	override async onCreate() {
		// @ts-ignore
		const storage: BrowserStorage =
			await robloxUserController.setUserAuthenticationStorage();

		if (storage.robloxUser?.id) {
			const [catalogItemsAutoBuyerAssets, filteredIds] =
				await robloxCatalogService.findManyFreeItemsAssetDetails(
					storage.robloxUser.id,
					storage.catalogItemsAutoBuyerAssetsFilteredId,
				);

			for (const id of filteredIds) {
				storage.catalogItemsAutoBuyerAssetsFilteredId[id] = true;
			}

			return Browser.storage.local.set({
				catalogItemsAutoBuyerAssetsTotal: catalogItemsAutoBuyerAssets.length,
				catalogItemsAutoBuyerAssets,
				catalogItemsAutoBuyerAssetsFilteredId:
					storage.catalogItemsAutoBuyerAssetsFilteredId,
			} as BrowserStorage);
		} else if (storage.catalogItemsAutoBuyerEnabled === undefined) {
			await Browser.storage.local.set({
				catalogItemsAutoBuyerEnabled: true,
			} as BrowserStorage);

			await Browser.windows.create({
				url: "popup.html",
				type: "panel",
				width: 580,
				height: 600,
			});
		}
	}

	override async onAlarm() {
		// @ts-ignore
		const storage: BrowserStorage = await Browser.storage.local.get(null);

		if (storage.robloxUser?.id) {
			if (storage.catalogItemsAutoBuyerAssets.length > 0) {
				const xcsrftoken = await robloxTokenService.getXCsrfToken();
				await this.purchaseItems(xcsrftoken, storage);
			}

			if (
				storage.catalogItemsAutoBuyerAssets.length <= storage.purchasesMultiplier
			) {
				this.onCreate();
			}
		}
	}

	async purchaseItems(xcsrftoken: string, storage: BrowserStorage) {
		const filteredIds: number[] = [];

		for (let i = 0; i < storage.purchasesMultiplier; i++) {
			try {
				filteredIds.push(storage.catalogItemsAutoBuyerAssets[i].id);
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
					message: "Item successfully purchased",
					iconUrl:
						storage.catalogItemsAutoBuyerAssets[i].imageBatch?.imageUrl || "icon.png",
					type: "basic",
					contextMessage: itemURL,
					appIconMaskUrl: "icon.png",
				});
			}
		}

		await Browser.storage.local.set({
			catalogItemsAutoBuyerAssets: storage.catalogItemsAutoBuyerAssets.filter(
				({ id }) => id != filteredIds.find((id2) => id2 == id),
			),
		} as BrowserStorage);
	}
}
