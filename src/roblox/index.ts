import RobloxController from './RobloxController';
import RobloxRepository from './RobloxRepository';
import RobloxService from './RobloxService';

namespace Roblox {
  export const repository = new RobloxRepository();
  export const service = new RobloxService(repository);
  export const controller = new RobloxController(service);
}

export default Roblox;
