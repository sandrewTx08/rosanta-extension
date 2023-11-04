import BrowserStorage from "../BrowserStorage";

export default Object.freeze({
	autoBuyerCatalogItemsDetailsEnabled: "autoBuyerCatalogItemsDetailsEnabled",
	ugcInGameNotifierEnabled: "ugcInGameNotifierEnabled",
} as { [K in keyof Required<BrowserStorage>]: K });
