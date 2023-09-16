import CatalogItemsDetailsShedulerData from './roblox/CatalogItemsDetailsShedulerData';

export default interface Storage {
  catalogItemsAutoBuyerAssets: [number, CatalogItemsDetailsShedulerData][];
  catalogItemsAutoBuyerEnabled: boolean;
  catalogItemsAutoBuyerNotification: boolean;
  catalogItemsAutoBuyerAssetsTotal: number;
}
