import RobloxUser from "./RobloxUser";
import AvatarHeadshot from "./AvatarHeadshot";

export default class RobloxUserRepository {
	getAuthenticatedUser(): Promise<RobloxUser> {
		return fetch("https://users.roblox.com/v1/users/authenticated").then(
			(response) => response.json(),
		);
	}

	isItemOwnedByUser(
		userId: number,
		itemType: number,
		itemTargetId: number,
	): Promise<boolean> {
		return fetch(
			`https://inventory.roblox.com/v1/users/${userId}/items/${itemType}/${itemTargetId}/is-owned`,
		).then((response) => response.json());
	}

	avatarHeadshot(
		userIds: number | number[],
		size: `${number}x${number}`,
		isCircular: boolean,
		format: string,
	): Promise<AvatarHeadshot> {
		return fetch(
			`https://thumbnails.roblox.com/v1/users/avatar-headshot?${new URLSearchParams(
				{ userIds, isCircular, size, format } as {},
			).toString()}`,
		).then((response) => response.json());
	}
}
