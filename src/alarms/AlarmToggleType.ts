import BrowserStorage from "../BrowserStorage";

export default Object.freeze({
	autoBuyerCatalogItemsDetailsEnabled: "autoBuyerCatalogItemsDetailsEnabled",
	limitedUgcInGameNotifierEnabled: "limitedUgcInGameNotifierEnabled",
} as { [K in keyof Required<BrowserStorage>]: K });
