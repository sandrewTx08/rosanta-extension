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
	autoBuyerCatalogItemsDetailsTotal: number;
	limitedUgcInGameNotifier: (BrowserStorage.CatalogItemsDetails & {
		imageBatch?: ImageBatchResponse["data"][0];
		gameURL: string | null;
	})[];
	limitedUgcInGameNotifierEnabled: boolean;
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
		autoBuyerCatalogItemsDetailsTotal: 0,
		autoBuyerCatalogItemsDetailsEnabled: null,
		limitedUgcInGameNotifier: [],
		limitedUgcInGameNotifierEnabled: false,
		catalogItemsDetailsOwnedId: {},
		avatarHeadshot: null,
		purchasesMultiplier: 5,
	};
}

export default BrowserStorage;
