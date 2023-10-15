import Browser from "webextension-polyfill";
import CatalogAutoBuyerAlarmNotificationsTypes from "./CatalogAutoBuyerAlarmNotificationsTypes";

export default class CatalogAutoBuyerAlarmNotifications {
	constructor() {
		Browser.alarms.onAlarm.addListener(async ({ name }) => {
			if (name === CatalogAutoBuyerAlarmNotificationsTypes.autobuyerDisabled) {
				// @ts-ignore
				const storage: BrowserStorage = await Browser.storage.local.get(null);

				if (
					storage.catalogItemsAutoBuyerNotification &&
					!storage.catalogItemsAutoBuyerEnabled
				) {
					Browser.notifications.create({
						type: "basic",
						iconUrl: "icon.png",
						title: "RoSanta autobuyer is disabled",
						message: "Enabling autobuyer new free items will be purchased",
					});
				}
			}
		});

		Browser.alarms.create(
			CatalogAutoBuyerAlarmNotificationsTypes.autobuyerDisabled,
			{ periodInMinutes: 40 },
		);
	}
}
