import Browser from "webextension-polyfill";
import LimitedUGCInGameNotifierAlarmToggle from "../alarms/LimitedUGCInGameNotifierAlarmToggle";
import CatalogAutoBuyerAlarmToggle from "../alarms/CatalogAutoBuyerAlarmToggle";
import CatalogAutoBuyerAlarmNotifications from "../alarms/CatalogAutoBuyerAlarmNotifications";

export const catalogAutoBuyerAlarmToggle = new CatalogAutoBuyerAlarmToggle();
export const catalogAutoBuyerAlarmNotifications =
	new CatalogAutoBuyerAlarmNotifications();
export const limitedUGCInGameNotifierAlarm =
	new LimitedUGCInGameNotifierAlarmToggle();

Browser.notifications.onClicked.addListener(async (notificationId) => {
	await Browser.notifications.clear(notificationId);

	if (!(notificationId in (await Browser.notifications.getAll()))) {
		await Browser.windows.create({
			url: "popup.html",
			type: "panel",
			width: 580,
			height: 600,
		});
	}
});
