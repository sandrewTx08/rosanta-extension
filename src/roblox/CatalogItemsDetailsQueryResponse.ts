export default interface CatalogItemsDetailsQueryResponse {
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
  creatorType: CreatorType;
  creatorTargetId: number;
  creatorName: string;
  price: number;
  priceStatus?: PriceStatus;
  purchaseCount: number;
  favoriteCount: number;
  offSaleDeadline: null;
  saleLocationType: SaleLocationType;
  assetType?: number;
}

export enum CreatorType {
  User = 'User'
}

export enum ItemRestriction {
  Live = 'Live',
  Rthro = 'Rthro'
}

export enum ItemType {
  Asset = 'Asset',
  Bundle = 'Bundle'
}

export enum PriceStatus {
  Free = 'Free',
  'Off Sale' = 'Off Sale'
}

export enum SaleLocationType {
  NotApplicable = 'NotApplicable'
}

export interface ElasticsearchDebugInfo {
  elasticsearchQuery: null;
  isFromCache: boolean;
  indexName: string;
  isTerminatedEarly: null;
  isForceTerminationEnabledByRequest: null;
}
