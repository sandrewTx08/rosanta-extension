import RobloxTokenRepository from "./RobloxTokenRepository";

export default class RobloxTokenService {
	#robloxTokenRepository: RobloxTokenRepository;

	constructor(robloxTokenRepository: RobloxTokenRepository) {
		this.#robloxTokenRepository = robloxTokenRepository;
	}

	getXCsrfToken() {
		return this.#robloxTokenRepository.getXCsrfTokenByPresence();
	}
}
