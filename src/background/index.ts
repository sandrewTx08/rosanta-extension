import Browser from "webextension-polyfill";
import LimitedUGCInGameNotifierAlarmToggle from "../alarms/LimitedUGCInGameNotifierAlarmToggle";
import RobloxFreeAutoBuyerAlarmToggle from "../alarms/RobloxFreeAutoBuyerAlarmToggle";

export const robloxFreeAutoBuyerAlarm = new RobloxFreeAutoBuyerAlarmToggle();
export const limitedUGCInGameNotifierAlarm =
	new LimitedUGCInGameNotifierAlarmToggle();

Browser.notifications.onClicked.addListener(async (notificationId) => {
	await Browser.notifications.clear(notificationId);

	if (!(notificationId in (await Browser.notifications.getAll()))) {
		await Browser.windows.create({
			url: "popup.html",
			type: "panel",
			width: 540,
			height: 600,
		});
	}
});
