import Browser from "webextension-polyfill";
import CatalogAutoBuyerAlarmNotificationsType from "./CatalogAutoBuyerAlarmNotificationsType";
import Alarm from "./Alarm";

export default class CatalogAutoBuyerAlarmNotifications extends Alarm {
	constructor() {
		super(CatalogAutoBuyerAlarmNotificationsType.autobuyerDisabled, 1440);

		Browser.alarms.onAlarm.addListener(async ({ name }) => {
			if (name === CatalogAutoBuyerAlarmNotificationsType.autobuyerDisabled) {
				// @ts-ignore
				const storage: BrowserStorage = await Browser.storage.local.get(null);

				if (
					storage.autoBuyerCatalogItemsDetailsNotification &&
					!storage.autoBuyerCatalogItemsDetailsEnabled
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

		this.createAlarm();
	}
}
