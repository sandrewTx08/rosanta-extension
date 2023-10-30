import Browser from "webextension-polyfill";

export default class Alarm implements Browser.Alarms.CreateAlarmInfoType {
	constructor(
		public name: string,
		public periodInMinutes: number,
		public when?: number,
	) {
		Browser.alarms.onAlarm.addListener(({ name }) => {
			if (name === this.name) {
				this.onAlarm();
			}
		});
	}

	createAlarm() {
		Browser.alarms.create(this.name, {
			periodInMinutes: this.periodInMinutes,
			when: this.when,
		});
	}

	onAlarm() {}

	onCreate() {}
}
