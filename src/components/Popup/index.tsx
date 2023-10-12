import { useEffect, useState } from "preact/hooks";
import Browser from "webextension-polyfill";
import "../../../index.scss";
import BrowserStorage from "../../BrowserStorage";
import { Stack, Tab, Tabs } from "react-bootstrap";
import CatalogItemsAutoBuyerTab from "./Tabs/CatalogItemsAutoBuyerTab";
import LimitedUGCInGameNotifier from "./Tabs/LimitedUGCInGameNotifierTab";
import { robloxUserService } from "../../roblox";
import PopupFooter from "./PopupFooter";
import PopupHeader from "./PopupHeader";

const Popup: React.FC = () => {
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
								storage =
									storage.robloxUser && storage.robloxUser.id != robloxUser.id
										? BrowserStorage.INITIAL_STORAGE
										: storage;
								storage.avatarHeadshot = avatarHeadshot;
								storage.robloxUser = robloxUser;

								setstorage(storage);

								Browser.storage.local.set(storage);
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
		<Stack gap={2} style={{ width: 540, height: 600 }}>
			<PopupHeader storage={storage} />

			<Tabs defaultActiveKey={TabEventKeys.AUTOBUYER} justify unmountOnExit>
				<Tab
					className="p-3 pt-1"
					eventKey={TabEventKeys.AUTOBUYER}
					title="Autobuyer"
				>
					<CatalogItemsAutoBuyerTab storage={[storage, setstorage]} />
				</Tab>
				<Tab className="p-3 pt-1" eventKey={TabEventKeys.UGC} title="UGC notifier">
					<LimitedUGCInGameNotifier storage={[storage, setstorage]} />
				</Tab>
			</Tabs>

			<PopupFooter />
		</Stack>
	);
};

export default Popup;
