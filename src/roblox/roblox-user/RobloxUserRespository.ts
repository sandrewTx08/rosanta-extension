import RobloxUser from "./RobloxUser";

export default class RobloxUserRepository {
	getAuthenticatedUser(): Promise<RobloxUser> {
		return fetch("https://users.roblox.com/v1/users/authenticated").then(
			(response) => response.json(),
		);
	}

	isItemOwndByUser(
		userId: number,
		itemType: number,
		itemTargetId: number,
	): Promise<boolean> {
		return fetch(
			`/v1/users/${userId}/items/${itemType}/${itemTargetId}/is-owned`,
		).then((response) => response.json());
	}
}
