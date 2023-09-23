import CatalogItemsDetailsQueryResponse from "./roblox/CatalogItemsDetailsQueryResponse";
import RobloxUser from "./roblox/roblox-user/RobloxUser";

export default interface BrowserStorage {
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
	limitedUGCInGameNotifierEnabled: boolean;
	robloxUser?: RobloxUser;
}
