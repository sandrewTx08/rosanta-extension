import { useEffect, useState } from "preact/hooks";
import Browser from "webextension-polyfill";
import "../../../index.scss";
import BrowserStorage from "../../BrowserStorage";
import { Tab, Tabs } from "react-bootstrap";
import CatalogItemsAutoBuyerTab from "./Tabs/CatalogItemsAutoBuyerTab";
import LimitedUGCInGameNotifier from "./Tabs/LimitedUGCInGameNotifierTab";
import { robloxUserService } from "../../roblox";
import PopupFooter from "./PopupFooter";
import PopupHeader from "./PopupHeader";

const Popup = () => {
	enum TabEventKeys {
		AUTOBUYER,
		UGC,
	}

	const [storage, setstorage] = useState(BrowserStorage.INITIAL_STORAGE);

	useEffect(() => {
		function eventHandler(
			changes: Browser.Storage.StorageAreaOnChangedChangesType,
		) {
			setstorage((value) => {
				for (const [key, change] of Object.entries(changes)) {
					// @ts-ignore
					value[key] = change.newValue || value[key];
				}

				return { ...value };
			});
		}

		Browser.storage.local.get(null).then(
			// @ts-ignore
			(storage: BrowserStorage) => {
				setstorage(storage);

				robloxUserService.getAuthenticatedUser().then((robloxUser) => {
					if (robloxUser?.id) {
						robloxUserService
							.avatarHeadshot(robloxUser.id, 720)
							.then((avatarHeadshot) => {
								setstorage({ ...storage, avatarHeadshot, robloxUser });

								Browser.storage.local.set({
									avatarHeadshot,
									robloxUser,
								} as BrowserStorage);
							});
					}
				});
			},
		);

		Browser.storage.local.onChanged.addListener(eventHandler);

		return () => {
			Browser.storage.local.onChanged.removeListener(eventHandler);
		};
	}, []);

	return (
		<div className="d-flex flex-column gap-2" style={{ width: 540, height: 600 }}>
			<PopupHeader storage={storage} />

			<main className="mb-auto d-flex flex-column gap-2 justify-content-between">
				<Tabs defaultActiveKey={TabEventKeys.AUTOBUYER} justify>
					<Tab eventKey={TabEventKeys.AUTOBUYER} title="Autobuyer">
						<CatalogItemsAutoBuyerTab storage={[storage, setstorage]} />
					</Tab>
					<Tab eventKey={TabEventKeys.UGC} title="UGC notifier">
						<LimitedUGCInGameNotifier storage={[storage, setstorage]} />
					</Tab>
				</Tabs>
			</main>

			<PopupFooter />
		</div>
	);
};

export default Popup;
