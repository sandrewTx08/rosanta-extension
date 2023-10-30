import { useEffect, useState } from "preact/hooks";
import Browser from "webextension-polyfill";
import "../../../index.scss";
import BrowserStorage from "../../BrowserStorage";
import { Modal, Stack, Tab, Tabs } from "react-bootstrap";
import CatalogItemsAutoBuyerTab from "./Tabs/CatalogItemsAutoBuyerTab";
import LimitedUGCInGameNotifier from "./Tabs/InGameUgcNotifierTab";
import PopupFooter from "./PopupFooter";
import PopupHeader from "./PopupHeader";
import About from "./Tabs/About";
import { robloxUserService } from "../../roblox";

const Popup: React.FC = () => {
	enum TabEventKeys {
		AUTOBUYER,
		UGC,
		ABOUT,
	}

	const [storage, setstorage] = useState(BrowserStorage.INITIAL_STORAGE);

	useEffect(() => {
		function storageAreaOnChangedChangesType(
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

		// @ts-ignore
		Browser.storage.local.get(null).then(setstorage);

		Browser.storage.local.onChanged.addListener(storageAreaOnChangedChangesType);

		return () => {
			Browser.storage.local.onChanged.removeListener(
				storageAreaOnChangedChangesType,
			);
		};
	}, []);

	useEffect(() => {
		if (storage.robloxUser?.id) {
			robloxUserService
				.avatarHeadshot(storage.robloxUser.id, 720)
				.then((avatarHeadshot) => {
					setstorage({ ...storage, avatarHeadshot });
				});
		}
	}, [storage.robloxUser?.id]);

	return (
		<Stack className="m-auto h-100 border" style={{ width: 540 }}>
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

			<Tabs
				className="bg-light"
				defaultActiveKey={TabEventKeys.AUTOBUYER}
				justify
				unmountOnExit
			>
				<Tab className="p-3" eventKey={TabEventKeys.AUTOBUYER} title="Autobuyer">
					<CatalogItemsAutoBuyerTab storage={[storage, setstorage]} />
				</Tab>
				<Tab className="p-3" eventKey={TabEventKeys.UGC} title="UGC notifier">
					<LimitedUGCInGameNotifier storage={[storage, setstorage]} />
				</Tab>
				<Tab className="p-3" eventKey={TabEventKeys.ABOUT} title="About">
					<About />
				</Tab>
			</Tabs>

			<PopupFooter />
		</Stack>
	);
};

export default Popup;
