import CatalogItemsDetailsQueryResponse from "./roblox/roblox-catalog/CatalogItemsDetailsQueryResponse";
import { ImageBatchResponse } from "./roblox/roblox-image-batch/ImageBatchResponse";
import AvatarHeadshot from "./roblox/roblox-user/AvatarHeadshot";
import RobloxUser from "./roblox/roblox-user/RobloxUser";

interface BrowserStorage {
	catalogItemsAutoBuyerAssets: (CatalogItemsDetailsQueryResponse["data"][0] & {
		imageBatch?: ImageBatchResponse["data"][0];
	})[];
	catalogItemsAutoBuyerEnabled: boolean;
	catalogItemsAutoBuyerNotification: boolean;
	catalogItemsAutoBuyerAssetsTotal: number;
	catalogItemsAutoBuyerTotalPages: number;
	catalogItemsAutoBuyerLimit: number;
	limitedUGCInGameNotifierAssets: (CatalogItemsDetailsQueryResponse["data"][0] & {
		gameURL: string;
		imageBatch?: ImageBatchResponse["data"][0];
	})[];
	sniperModeAutoBuyerEnabled: boolean;
	limitedUGCInGameNotifierEnabled: boolean;
	robloxUser?: RobloxUser;
	avatarHeadshot?: AvatarHeadshot;
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
