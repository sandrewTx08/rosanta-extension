export default interface AvatarHeadshot {
	data: Datum[];
}

export interface Datum {
	targetId: number;
	state: string;
	imageUrl: string;
	version: string;
}
