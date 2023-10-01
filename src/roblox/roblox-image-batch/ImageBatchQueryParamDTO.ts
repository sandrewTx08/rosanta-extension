export default class ImageBatchQueryParamDTO {
	size: `${number}x${number}`;

	constructor(
		public targetId: number,
		public type: string,
		public format: "Png" | "Jpeg" = "Png",
	) {
		this.size = `${420}x${420}`;

		if (type.includes("Bundle")) {
			this.type = "BundleThumbnail";
		} else if (type.includes("Asset")) {
			this.size = `${700}x${700}`;
		}
	}
}
