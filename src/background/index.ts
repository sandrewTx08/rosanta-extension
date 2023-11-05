import Browser from "webextension-polyfill";
import CatalogAutoBuyerAlarmToggle from "../alarms/CatalogAutoBuyerAlarmToggle";
import CatalogAutoBuyerAlarmNotifications from "../alarms/CatalogAutoBuyerAlarmNotifications";
import UserAuthenticationAlarm from "../alarms/UserAuthenticationAlarm";
import InGameUgcNotifierAlarmToggle from "../alarms/InGameUgcNotifierAlarmToggle";
import BrowserStorage from "../BrowserStorage";

export const catalogItemsDetailsAlarm = new UserAuthenticationAlarm();
export const catalogAutoBuyerAlarmToggle = new CatalogAutoBuyerAlarmToggle();
export const catalogAutoBuyerAlarmNotifications =
	new CatalogAutoBuyerAlarmNotifications();
export const inGameUgcNotifierAlarmToggle = new InGameUgcNotifierAlarmToggle();

Browser.notifications.onClicked.addListener(async (notificationId) => {
	await Browser.notifications.clear(notificationId);

	if (!(notificationId in (await Browser.notifications.getAll()))) {
		Browser.windows.create({
			url: "popup.html",
			type: "panel",
			width: 580,
			height: 600,
		});
	}
});

Browser.runtime.onInstalled.addListener(() => {
	Browser.storage.local.set(BrowserStorage.INITIAL_STORAGE);

	Browser.windows.create({
		url: "popup.html",
		type: "panel",
		width: 580,
		height: 600,
	});
});
