import CatalogItemsDetailsQueryResponse from "./roblox/roblox-catalog/CatalogItemsDetailsQueryResponse";
import { ImageBatchResponse } from "./roblox/roblox-image-batch/ImageBatchResponse";
import AvatarHeadshot from "./roblox/roblox-user/AvatarHeadshot";
import RobloxUser from "./roblox/roblox-user/RobloxUser";

interface BrowserStorage {
	catalogItemsAutoBuyerAssets: (CatalogItemsDetailsQueryResponse["data"][0] & {
		imageBatch?: ImageBatchResponse["data"][0];
	})[];
	catalogItemsAutoBuyerAssetsFilteredId: { [id: number]: boolean };
	catalogItemsAutoBuyerEnabled?: boolean;
	catalogItemsAutoBuyerNotification: boolean;
	catalogItemsAutoBuyerAssetsTotal: number;
	limitedUGCInGameNotifierAssets: (CatalogItemsDetailsQueryResponse["data"][0] & {
		gameURL: string;
		imageBatch?: ImageBatchResponse["data"][0];
	})[];
	limitedUGCInGameNotifierEnabled: boolean;
	robloxUser?: RobloxUser;
	avatarHeadshot?: AvatarHeadshot;
	purchasesMultiplier: number;
}

namespace BrowserStorage {
	export const INITIAL_STORAGE: BrowserStorage = {
		catalogItemsAutoBuyerAssets: [],
		catalogItemsAutoBuyerNotification: true,
		catalogItemsAutoBuyerAssetsTotal: 0,
		limitedUGCInGameNotifierAssets: [],
		catalogItemsAutoBuyerAssetsFilteredId: {},
		limitedUGCInGameNotifierEnabled: false,
		purchasesMultiplier: 3,
	};
}

export default BrowserStorage;
