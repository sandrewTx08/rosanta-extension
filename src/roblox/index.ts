import RobloxCatalogRepository from "./roblox-catalog/RobloxCatalogRepository";
import RobloxCatalogService from "./roblox-catalog/RobloxCatalogService";
import RobloxImageBatchRepository from "./roblox-image-batch/RobloxImageBatchRepository";
import RobloxImageBatchService from "./roblox-image-batch/RobloxImageBatchService";
import RobloxTokenRepository from "./roblox-token/RobloxTokenRepository";
import RobloxTokenService from "./roblox-token/RobloxTokenService";
import RobloxUserRepository from "./roblox-user/RobloxUserRespository";
import RobloxUserService from "./roblox-user/RobloxUserService";

export const robloxImageBatchService = new RobloxImageBatchService(
	new RobloxImageBatchRepository(),
);
export const robloxUserService = new RobloxUserService(
	new RobloxUserRepository(),
);
export const robloxCatalogService = new RobloxCatalogService(
	new RobloxCatalogRepository(),
	robloxImageBatchService,
	robloxUserService,
);
export const robloxTokenService = new RobloxTokenService(
	new RobloxTokenRepository(),
);
