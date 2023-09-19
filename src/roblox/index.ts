import RobloxCatalogRepository from './roblox-catalog/RobloxCatalogRepository';
import RobloxCatalogService from './roblox-catalog/RobloxCatalogService';
import RobloxTokenRepository from './roblox-token/RobloxTokenRepository';
import RobloxTokenService from './roblox-token/RobloxTokenService';
import RobloxUserRepository from './roblox-user/RobloxUserRespository';
import RobloxUserService from './roblox-user/RobloxUserService';

export const robloxCatalogService = new RobloxCatalogService(new RobloxCatalogRepository());
export const robloxTokenService = new RobloxTokenService(new RobloxTokenRepository());
export const robloxUserService = new RobloxUserService(new RobloxUserRepository());
