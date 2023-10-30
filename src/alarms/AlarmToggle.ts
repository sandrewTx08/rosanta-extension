import Browser from "webextension-polyfill";
import AlarmToggleTypes from "./AlarmToggleType";
import BrowserStorage from "../BrowserStorage";
import Alarm from "./Alarm";

export default class AlarmToggle
	extends Alarm
	implements Browser.Alarms.CreateAlarmInfoType
{
	constructor(
		name: keyof typeof AlarmToggleTypes,
		periodInMinutes: number,
		when: number,
	) {
		super(name, periodInMinutes, when);

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
}
