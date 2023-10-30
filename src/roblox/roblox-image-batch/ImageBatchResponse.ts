export default interface ImageBatchResponse {
	data: Datum[];
}

export interface Datum {
	requestId: null;
	errorCode: number;
	errorMessage: string;
	targetId: number;
	state: string;
	imageUrl: string;
	version: string;
}
