import CatalogItemsDetailsShedulerData from './roblox/CatalogItemsDetailsShedulerData';

export default interface Storage {
  catalogAssetDetails: [number, CatalogItemsDetailsShedulerData][];
  enableBot: boolean;
  purchasesNotification: boolean;
  catalogAssetDetailsTotal: number;
}
