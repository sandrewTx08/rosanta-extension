export default class RobloxTokenRepository {
	getXCsrfTokenByPresence(): Promise<string> {
		return fetch(
			"https://presence.roblox.com/v1/presence/register-app-presence",
			{
				method: "POST",
			},
		).then(
			(response) =>
				response.headers.get("x-csrf-token") ||
				response.headers.get("X-CSRF-TOKEN") ||
				"",
		);
	}
}
