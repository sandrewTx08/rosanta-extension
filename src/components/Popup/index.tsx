import { useEffect, useState } from "preact/hooks";
import Browser from "webextension-polyfill";
import "../../../index.scss";
import BrowserStorage from "../../BrowserStorage";
import { Modal, Stack, Tab, Tabs } from "react-bootstrap";
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
			(_storage: BrowserStorage) => {
				setstorage(_storage);

				robloxUserService.getAuthenticatedUser().then((robloxUser) => {
					if (robloxUser?.id) {
						robloxUserService
							.avatarHeadshot(robloxUser.id, 720)
							.then((avatarHeadshot) => {
								_storage =
									storage.robloxUser?.id && _storage.robloxUser?.id != robloxUser.id
										? BrowserStorage.INITIAL_STORAGE
										: _storage;
								_storage.avatarHeadshot = avatarHeadshot;
								_storage.robloxUser = robloxUser;

								Browser.storage.local.set(_storage);
							});
					} else {
						setstorage({ ...storage, robloxUser: null });
						Browser.storage.local.set({ robloxUser: null } as BrowserStorage);
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
		<Stack className="m-auto" gap={2} style={{ width: 540, minHeight: 600 }}>
			<PopupHeader storage={storage} />

			<Modal
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
				show={storage.robloxUser === null}
			>
				<Modal.Header>
					<Modal.Title id="contained-modal-title-vcenter">
						User not authenticated, please{" "}
						<a href="https://www.roblox.com/login">log in</a>
					</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					Some functionality may not work properly or are disabled if not logged in,
					please <a href="https://www.roblox.com/login">log in</a>.
				</Modal.Body>
			</Modal>

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
