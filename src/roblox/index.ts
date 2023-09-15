import RobloxRepository from './RobloxRepository';
import RobloxService from './RobloxService';

export const robloxRepository = new RobloxRepository();
export const robloxService = new RobloxService(robloxRepository);
