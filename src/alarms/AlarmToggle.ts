import Browser from "webextension-polyfill";
import AlarmToggleTypes from "./AlarmToggleTypes";
import BrowserStorage from "../BrowserStorage";

export default class AlarmToggle implements Browser.Alarms.CreateAlarmInfoType {
	constructor(
		public name: keyof typeof AlarmToggleTypes,
		public periodInMinutes: number,
	) {
		Browser.alarms.onAlarm.addListener((alarm) => {
			if (alarm.name === this.name) {
				this.onAlarm();
			}
		});

		Browser.storage.local.onChanged.addListener(async (changes) => {
			if (
				this.name in changes &&
				changes[this.name].newValue != changes[this.name].oldValue
			) {
				if (changes[this.name].newValue && !(await Browser.alarms.get(this.name))) {
					this.createAlarm();
					this.onCreate();
				} else if (!changes[this.name].newValue) {
					Browser.alarms.clear(this.name);
				}
			}
		});

		Browser.runtime.onInstalled.addListener(() => {
			Browser.storage.local.set(BrowserStorage.INITIAL_STORAGE);
		});
	}

	createAlarm() {
		Browser.alarms.create(this.name, {
			periodInMinutes: this.periodInMinutes,
			when: 0,
		});
	}

	onAlarm() {}

	onCreate() {}
}
