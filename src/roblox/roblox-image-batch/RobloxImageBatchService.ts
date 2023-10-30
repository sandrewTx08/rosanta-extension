import ImageBatchQueryParamDTO from "./ImageBatchQueryParamDTO";
import ImageBatchResponse from "./ImageBatchResponse";
import RobloxImageBatchRepository from "./RobloxImageBatchRepository";

export default class RobloxImageBatchService {
	#robloxImageBatchRepository: RobloxImageBatchRepository;

	constructor(robloxImageBatchRepository: RobloxImageBatchRepository) {
		this.#robloxImageBatchRepository = robloxImageBatchRepository;
	}

	async findManyImagesBatches(
		imageBatchQueryParamDTOs: ImageBatchQueryParamDTO[],
		skip: number = 20,
	) {
		const data: Promise<ImageBatchResponse>[] = [];

		for (let i = 0; i < imageBatchQueryParamDTOs.length; i += skip) {
			data.push(
				this.#robloxImageBatchRepository.findManyImagesBatches(
					imageBatchQueryParamDTOs.slice(i, i + skip),
				),
			);
		}

		return (await Promise.all(data)).reduce<ImageBatchResponse["data"]>(
			(p, c) => (c?.data ? p.concat(c.data) : p),
			[],
		);
	}
}
