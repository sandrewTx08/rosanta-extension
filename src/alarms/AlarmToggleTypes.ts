import BrowserStorage from "../BrowserStorage";

export default Object.freeze({
	catalogItemsAutoBuyerEnabled: "catalogItemsAutoBuyerEnabled",
	limitedUGCInGameNotifierEnabled: "limitedUGCInGameNotifierEnabled",
} as { [K in keyof Required<BrowserStorage>]: K });
