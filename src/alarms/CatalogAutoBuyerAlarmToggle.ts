import Browser from "webextension-polyfill";
import BrowserStorage from "../BrowserStorage";
import {
	robloxCatalogController,
	robloxCatalogService,
	robloxTokenService,
} from "../roblox";
import AlarmToggleType from "./AlarmToggleType";
import AlarmToggle from "./AlarmToggle";
import ProductPurchaseDTO from "../roblox/roblox-catalog/ProductPurchaseDTO";

export default class CatalogAutoBuyerAlarmToggle extends AlarmToggle {
	constructor() {
		super(AlarmToggleType.autoBuyerCatalogItemsDetailsEnabled, 1, 0);
	}

	override async onCreate() {
		// @ts-ignore
		const storage: BrowserStorage = await Browser.storage.local.get(null);

		if (storage.robloxUser?.id) {
			let { catalogItemsDetails, catalogItemsDetailsOwnedId } =
				await robloxCatalogController.findManyFreeCatalogItemsDetails(
					storage.robloxUser?.id,
					storage.catalogItemsDetailsOwnedId,
				);

			Browser.storage.local.set({
				autoBuyerCatalogItemsDetails: catalogItemsDetails,
				catalogItemsDetailsOwnedId: catalogItemsDetailsOwnedId,
			} as BrowserStorage);
		}
	}

	override async onAlarm() {
		// @ts-ignore
		const storage: BrowserStorage = await Browser.storage.local.get(null);

		if (storage.robloxUser?.id) {
			if (storage.autoBuyerCatalogItemsDetails.length > 0) {
				const xcsrftoken = await robloxTokenService.getXCsrfToken();
				await this.purchaseItems(xcsrftoken, storage);
			}

			if (
				storage.autoBuyerCatalogItemsDetails.length <= storage.purchasesMultiplier
			) {
				this.onCreate();
			}
		}
	}

	async purchaseItems(xcsrftoken: string, storage: BrowserStorage) {
		const purchases: Promise<void>[] = [];
		let changed = false;

		for (let i = 0; i < storage.purchasesMultiplier; i++) {
			try {
				const catalogItemDetail = storage.autoBuyerCatalogItemsDetails[i];

				purchases.push(
					robloxCatalogService
						.purchaseProduct(
							catalogItemDetail.productId,
							new ProductPurchaseDTO(0, 0, catalogItemDetail.creatorTargetId),
							xcsrftoken,
						)
						.then(({ purchased }) => {
							storage.catalogItemsDetailsOwnedId[catalogItemDetail.id] = purchased;

							if (purchased) {
								changed = true;
							}
						}),
				);
			} catch (error) {
				break;
			}
		}

		await Promise.all(purchases);

		if (changed) {
			if (
				storage.autoBuyerCatalogItemsDetailsNotification &&
				storage.autoBuyerCatalogItemsDetails.length <= storage.purchasesMultiplier
			) {
				const catalogItemsDetailsOwnedIdLength = (
					Object.keys(storage.catalogItemsDetailsOwnedId) as unknown as number[]
				).reduce((p, c) => (storage.catalogItemsDetailsOwnedId[c] ? ++p : p), 0);

				Browser.notifications.create({
					title: `Autobuyer finished the scan with ${catalogItemsDetailsOwnedIdLength} items owned`,
					message: `${storage.robloxUser?.name} owned a total of ${catalogItemsDetailsOwnedIdLength} free items`,
					iconUrl: "icon.png",
					type: "basic",
					appIconMaskUrl: "icon.png",
				});
			}

			Browser.storage.local.set({
				catalogItemsDetailsOwnedId: storage.catalogItemsDetailsOwnedId,
				autoBuyerCatalogItemsDetails: storage.autoBuyerCatalogItemsDetails.filter(
					({ id }) => !storage.catalogItemsDetailsOwnedId[id],
				),
			} as BrowserStorage);
		}
	}
}
