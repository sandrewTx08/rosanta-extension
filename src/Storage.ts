import CatalogItemsDetailsShedulerData from './roblox/CatalogItemsDetailsShedulerData';
import RobloxUser from './roblox/roblox-user/RobloxUser';

export default interface Storage {
  catalogItemsAutoBuyerAssets: [number, CatalogItemsDetailsShedulerData][];
  catalogItemsAutoBuyerEnabled: boolean;
  catalogItemsAutoBuyerNotification: boolean;
  catalogItemsAutoBuyerAssetsTotal: number;
  catalogItemsAutoBuyerTotalPages: number;
  catalogItemsAutoBuyerLimit: number;
  robloxUser?: RobloxUser;
}
