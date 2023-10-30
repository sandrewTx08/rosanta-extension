import RobloxCatalogController from "./roblox-catalog/RobloxCatalogController";
import RobloxCatalogRepository from "./roblox-catalog/RobloxCatalogRepository";
import RobloxCatalogService from "./roblox-catalog/RobloxCatalogService";
import RobloxImageBatchRepository from "./roblox-image-batch/RobloxImageBatchRepository";
import RobloxImageBatchService from "./roblox-image-batch/RobloxImageBatchService";
import RobloxTokenRepository from "./roblox-token/RobloxTokenRepository";
import RobloxTokenService from "./roblox-token/RobloxTokenService";
import RobloxUserController from "./roblox-user/RobloxUserController";
import RobloxUserRepository from "./roblox-user/RobloxUserRespository";
import RobloxUserService from "./roblox-user/RobloxUserService";

export const robloxImageBatchService = new RobloxImageBatchService(
	new RobloxImageBatchRepository(),
);
export const robloxUserService = new RobloxUserService(
	new RobloxUserRepository(),
);
export const robloxUserController = new RobloxUserController(robloxUserService);
export const robloxCatalogService = new RobloxCatalogService(
	new RobloxCatalogRepository(),
);
export const robloxCatalogController = new RobloxCatalogController(
	robloxCatalogService,
	robloxUserService,
	robloxImageBatchService,
);
export const robloxTokenService = new RobloxTokenService(
	new RobloxTokenRepository(),
);
