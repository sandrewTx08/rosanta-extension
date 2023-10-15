import Browser from "webextension-polyfill";
import AlarmToggleTypes from "./AlarmToggleTypes";
import BrowserStorage from "../BrowserStorage";

export default class AlarmToggle
	implements Required<Pick<Browser.Alarms.Alarm, "name" | "periodInMinutes">>
{
	constructor(
		public name: keyof typeof AlarmToggleTypes,
		public periodInMinutes: number,
	) {
		Browser.storage.local.onChanged.addListener((changes) => {
			if (this.name in changes) {
				if (changes[this.name].newValue) {
					Browser.alarms.create(this.name, {
						periodInMinutes: this.periodInMinutes,
					});
					this.onCreate();
				} else {
					Browser.alarms.clear(this.name);
				}
			}
		});

		Browser.alarms.onAlarm.addListener((alarm) => {
			if (alarm.name === this.name) {
				this.onAlarm();
			}
		});

		Browser.notifications.onClicked.addListener(() => {
			Browser.windows.create({ url: "popup.html", type: "popup" });
		});

		Browser.runtime.onInstalled.addListener(() => {
			Browser.storage.local.set(BrowserStorage.INITIAL_STORAGE);
		});
	}

	onAlarm() {}

	onCreate() {}
}
