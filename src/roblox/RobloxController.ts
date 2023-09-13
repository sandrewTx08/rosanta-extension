import Browser from 'webextension-polyfill';
import ProductPurchaseDTO from './ProductPurchaseDTO';
import RobloxService from './RobloxService';
import AssetsPurchaser from './AssetsPurchaser';

export default class RobloxController {
  #robloxService;

  constructor(robloxService: RobloxService) {
    this.#robloxService = robloxService;
  }
}
