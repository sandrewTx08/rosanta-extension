import CatalogItemsDetailsQueryResponse from "./roblox/CatalogItemsDetailsQueryResponse";
import RobloxUser from "./roblox/roblox-user/RobloxUser";

interface BrowserStorage {
	catalogItemsAutoBuyerAssets: CatalogItemsDetailsQueryResponse["data"];
	catalogItemsAutoBuyerEnabled: boolean;
	catalogItemsAutoBuyerNotification: boolean;
	catalogItemsAutoBuyerAssetsTotal: number;
	catalogItemsAutoBuyerTotalPages: number;
	catalogItemsAutoBuyerLimit: number;
	limitedUGCInGameNotifierAssets: (CatalogItemsDetailsQueryResponse["data"][0] & {
		gameURL: string;
		imageBatch: any;
	})[];
	sniperModeAutoBuyerEnabled: boolean;
	limitedUGCInGameNotifierEnabled: boolean;
	robloxUser?: RobloxUser;
}

namespace BrowserStorage {
	export const INITIAL_STORAGE: BrowserStorage = {
		catalogItemsAutoBuyerLimit: 120,
		catalogItemsAutoBuyerEnabled: false,
		catalogItemsAutoBuyerAssets: [],
		catalogItemsAutoBuyerNotification: true,
		catalogItemsAutoBuyerAssetsTotal: 0,
		catalogItemsAutoBuyerTotalPages: 30,
		limitedUGCInGameNotifierAssets: [],
		limitedUGCInGameNotifierEnabled: false,
		sniperModeAutoBuyerEnabled: false,
	};
}

export default BrowserStorage;
