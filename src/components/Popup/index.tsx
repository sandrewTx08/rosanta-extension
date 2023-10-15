import { useEffect, useState } from "preact/hooks";
import Browser from "webextension-polyfill";
import "../../../index.scss";
import BrowserStorage from "../../BrowserStorage";
import { Modal, Stack, Tab, Tabs } from "react-bootstrap";
import CatalogItemsAutoBuyerTab from "./Tabs/CatalogItemsAutoBuyerTab";
import LimitedUGCInGameNotifier from "./Tabs/LimitedUGCInGameNotifierTab";
import { robloxUserController } from "../../roblox";
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

		robloxUserController.setUserAuthenticationStorage().then(setstorage);

		Browser.storage.local.onChanged.addListener(eventHandler);

		return () => {
			Browser.storage.local.onChanged.removeListener(eventHandler);
		};
	}, []);

	return (
		<Stack gap={2} className="m-auto" style={{ width: 540, minHeight: 600 }}>
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
