import ImageBatchQueryParamDTO from "./ImageBatchQueryParamDTO";
import { ImageBatchResponse } from "./ImageBatchResponse";

export default class RobloxImageBatchRepository {
	findManyImagesBatches(
		imageBatchQueryParamDTOs: ImageBatchQueryParamDTO[],
	): Promise<ImageBatchResponse> {
		return fetch("https://thumbnails.roblox.com/v1/batch", {
			method: "POST",
			body: JSON.stringify(imageBatchQueryParamDTOs),
		}).then((response) => response.json());
	}
}
