import BrowserStorage from "../BrowserStorage";

export default Object.freeze({
	catalogItemsAutoBuyerEnabled: "catalogItemsAutoBuyerEnabled",
	limitedUGCInGameNotifierEnabled: "limitedUGCInGameNotifierEnabled",
} as { [K in keyof BrowserStorage]: K });
