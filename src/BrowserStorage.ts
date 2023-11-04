import { Datum } from "./roblox/roblox-catalog/CatalogItemsDetailsResponse";
import ImageBatchResponse from "./roblox/roblox-image-batch/ImageBatchResponse";
import AvatarHeadshot from "./roblox/roblox-user/AvatarHeadshot";
import RobloxUser from "./roblox/roblox-user/RobloxUser";

interface BrowserStorage {
	autoBuyerCatalogItemsDetails: (BrowserStorage.CatalogItemsDetails & {
		imageBatch?: ImageBatchResponse["data"][0];
	})[];
	autoBuyerCatalogItemsDetailsEnabled: boolean | null;
	autoBuyerCatalogItemsDetailsNotification: boolean;
	ugcInGameNotifier: (BrowserStorage.CatalogItemsDetails & {
		imageBatch?: ImageBatchResponse["data"][0];
		gameURL: string | null;
	})[];
	ugcInGameNotifierEnabled: boolean;
	robloxUser?: RobloxUser | null;
	avatarHeadshot: AvatarHeadshot | null;
	purchasesMultiplier: number;
	catalogItemsDetailsOwnedId: Record<number, boolean>;
}

namespace BrowserStorage {
	export interface CatalogItemsDetails extends Datum {
		imageBatch?: ImageBatchResponse["data"][0];
	}

	export const INITIAL_STORAGE: BrowserStorage = {
		autoBuyerCatalogItemsDetails: [],
		autoBuyerCatalogItemsDetailsNotification: true,
		autoBuyerCatalogItemsDetailsEnabled: null,
		ugcInGameNotifier: [],
		ugcInGameNotifierEnabled: false,
		catalogItemsDetailsOwnedId: {},
		avatarHeadshot: null,
		purchasesMultiplier: 5,
	};
}

export default BrowserStorage;
