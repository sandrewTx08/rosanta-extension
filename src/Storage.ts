import AssetsPurchaser from './roblox/AssetsPurchaser';

export default interface Storage {
  catalogAssetDetails: [number, AssetsPurchaser][];
  enableBot: boolean;
  purchasesNotification: boolean;
  catalogAssetDetailsTotal: number;
}
