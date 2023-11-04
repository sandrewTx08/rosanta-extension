export default interface CatalogItemsDetailsResponse {
	keyword: null;
	elasticsearchDebugInfo: ElasticsearchDebugInfo;
	previousPageCursor: null;
	nextPageCursor: string;
	data: Datum[];
}

export interface Datum {
	id: number;
	itemType: ItemType;
	bundleType?: number;
	name: string;
	description: string;
	productId: number;
	itemStatus: any[];
	itemRestrictions: ItemRestriction[];
	creatorHasVerifiedBadge: boolean;
	unitsAvailableForConsumption: number;
	creatorType: CreatorType;
	creatorTargetId: number;
	collectibleItemId: string;
	creatorName: string;
	price: number;
	priceStatus?: PriceStatus;
	purchaseCount: number;
	totalQuantity?: number;
	favoriteCount: number;
	offSaleDeadline: null;
	saleLocationType: SaleLocationType;
	assetType?: number;
}

export enum CreatorType {
	User = "User",
	Group = "Group",
}

export enum ItemRestriction {
	Live = "Live",
	Rthro = "Rthro",
}

export enum ItemType {
	Asset = "Asset",
	Bundle = "Bundle",
}

export enum PriceStatus {
	Free = "Free",
	"Off Sale" = "Off Sale",
}

export enum SaleLocationType {
	NotApplicable = "NotApplicable",
	ExperiencesDevApiOnly = "ExperiencesDevApiOnly",
}

export interface ElasticsearchDebugInfo {
	elasticsearchQuery: null;
	isFromCache: boolean;
	indexName: string;
	isTerminatedEarly: null;
	isForceTerminationEnabledByRequest: null;
}
