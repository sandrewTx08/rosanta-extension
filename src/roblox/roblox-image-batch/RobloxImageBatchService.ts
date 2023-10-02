import ImageBatchQueryParamDTO from "./ImageBatchQueryParamDTO";
import { ImageBatchResponse } from "./ImageBatchResponse";
import RobloxImageBatchRepository from "./RobloxImageBatchRepository";

export default class RobloxImageBatchService {
	#robloxImageBatchRepository: RobloxImageBatchRepository;

	constructor(robloxImageBatchRepository: RobloxImageBatchRepository) {
		this.#robloxImageBatchRepository = robloxImageBatchRepository;
	}

	async findManyImagesBatches(
		imageBatchQueryParamDTOs: ImageBatchQueryParamDTO[],
		skip: number = 10,
	) {
		let responses: Promise<ImageBatchResponse>[] = [];

		for (let i = 0; i < imageBatchQueryParamDTOs.length; i += skip) {
			responses.push(
				this.#robloxImageBatchRepository.findManyImagesBatches(
					imageBatchQueryParamDTOs.slice(i, i + skip),
				),
			);
		}

		return (await Promise.all(responses))
			.reduce<ImageBatchResponse["data"]>(
				(p, c) => ("data" in c ? p.concat(c.data) : p),
				[],
			)
			.sort(({ targetId: asc }, { targetId: desc }) => desc - asc);
	}
}
