import ImageBatchQueryParamDTO from "./ImageBatchQueryParamDTO";
import RobloxImageBatchRepository from "./RobloxImageBatchRepository";

export default class RobloxImageBatchService {
	#robloxImageBatchRepository: RobloxImageBatchRepository;

	constructor(robloxImageBatchRepository: RobloxImageBatchRepository) {
		this.#robloxImageBatchRepository = robloxImageBatchRepository;
	}

	findManyImagesBatches(imageBatchQueryParamDTOs: ImageBatchQueryParamDTO[]) {
		return this.#robloxImageBatchRepository.findManyImagesBatches(
			imageBatchQueryParamDTOs,
		);
	}
}
