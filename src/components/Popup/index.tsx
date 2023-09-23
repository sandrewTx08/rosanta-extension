import { useEffect, useState } from "preact/hooks";
import Browser from "webextension-polyfill";
import "../../../index.scss";
import BrowserStorage from "../../BrowserStorage";
import { Tab, Tabs } from "react-bootstrap";
import CatalogItemsAutoBuyerTab from "./Tabs/CatalogItemsAutoBuyerTab";
import UserTab from "./Tabs/UserTab";
import LimitedUGCInGameNotifier from "./Tabs/LimitedUGCInGameNotifierTab";
import { robloxUserService } from "../../roblox";

const Popup = () => {
	enum TabEventKeys {
		AUTOBUYER,
		UGC,
		USER,
	}

	const [storage, setstorage] = useState(BrowserStorage.INITIAL_STORAGE);
	const [loading, setloading] = useState(false);

	useEffect(() => {
		setloading(true);

		Browser.storage.local
			.get(null)
			.then(
				// @ts-ignore
				(storage: BrowserStorage) => {
					setstorage(storage);

					if (!storage.robloxUser) {
						robloxUserService.getAuthenticatedUser().then((robloxUser) => {
							if (robloxUser?.id) {
								Browser.storage.local.set({ robloxUser } as BrowserStorage);
							}
						});
					}
				},
			)
			.finally(() => {
				setloading(false);
			});

		Browser.storage.local.onChanged.addListener((storage) => {
			if (storage.catalogItemsAutoBuyerAssets) {
				setstorage((value) => {
					value.catalogItemsAutoBuyerAssets =
						storage.catalogItemsAutoBuyerAssets.newValue;
					value.catalogItemsAutoBuyerAssetsTotal =
						storage.catalogItemsAutoBuyerAssetsTotal?.newValue ||
						value.catalogItemsAutoBuyerAssetsTotal;
					return { ...value };
				});
				setloading(false);
			}

			if (storage.limitedUGCInGameNotifierAssets) {
				setstorage((value) => {
					value.limitedUGCInGameNotifierAssets =
						storage.limitedUGCInGameNotifierAssets.newValue;
					return { ...value };
				});
				setloading(false);
			}
		});
	}, []);

	return (
		<main style={{ width: 256 }}>
			<div className="d-flex justify-content-center" style={{ height: 128 }}>
				<img className="h-100 w-auto" src="icon.png" />
			</div>

			<Tabs defaultActiveKey={TabEventKeys.AUTOBUYER} justify>
				<Tab eventKey={TabEventKeys.AUTOBUYER} title="Free items auto-buyer">
					<CatalogItemsAutoBuyerTab
						loading={[loading, setloading]}
						storage={[storage, setstorage]}
					/>
				</Tab>
				<Tab eventKey={TabEventKeys.UGC} title="Limited UGC in-game notifier">
					<LimitedUGCInGameNotifier
						loading={[loading, setloading]}
						storage={[storage, setstorage]}
					/>
				</Tab>
				<Tab eventKey={TabEventKeys.USER} title="My User">
					<UserTab robloxUser={storage.robloxUser} />
				</Tab>
			</Tabs>
		</main>
	);
};

export default Popup;
