import { useEffect, useState } from "preact/hooks";
import Browser from "webextension-polyfill";
import BrowserStorage from "../../BrowserStorage";
import { Tab, Tabs } from "react-bootstrap";
import CatalogItemsAutoBuyerTab from "./Tabs/CatalogItemsAutoBuyerTab";
import LimitedUGCInGameNotifier from "./Tabs/LimitedUGCInGameNotifierTab";
import { robloxUserService } from "../../roblox";
import PopupFooter from "./PopupFooter";
import PopupHeader from "./PopupHeader";

export const Popup = () => {
	enum TabEventKeys {
		AUTOBUYER,
		UGC,
	}

	const [storage, setstorage] = useState(BrowserStorage.INITIAL_STORAGE);

	useEffect(() => {
		Browser.storage.local.get(null).then(
			// @ts-ignore
			(storage: BrowserStorage) => {
				setstorage(storage);

				return robloxUserService.getAuthenticatedUser().then((robloxUser) => {
					if (robloxUser?.id) {
						robloxUserService
							.avatarHeadshot(robloxUser.id, 720)
							.then((avatarHeadshot) => {
								Browser.storage.local.set({
									avatarHeadshot,
								} as BrowserStorage);
							});

						return Browser.storage.local.set({
							robloxUser,
						} as BrowserStorage);
					}
				});
			},
		);

		Browser.storage.local.onChanged.addListener((storage) => {
			if (storage.avatarHeadshot) {
				setstorage((value) => {
					value.avatarHeadshot = storage.avatarHeadshot.newValue;
					value.robloxUser = storage.robloxUser.newValue;
					return { ...value };
				});
			}

			if (storage.catalogItemsAutoBuyerAssets) {
				setstorage((value) => {
					value.catalogItemsAutoBuyerAssets =
						storage.catalogItemsAutoBuyerAssets.newValue;
					value.catalogItemsAutoBuyerAssetsTotal =
						storage.catalogItemsAutoBuyerAssetsTotal?.newValue ||
						value.catalogItemsAutoBuyerAssetsTotal;
					return { ...value };
				});
			}

			if (storage.limitedUGCInGameNotifierAssets) {
				setstorage((value) => {
					value.limitedUGCInGameNotifierAssets =
						storage.limitedUGCInGameNotifierAssets.newValue;
					return { ...value };
				});
			}
		});
	}, []);

	return (
		<div className="d-flex flex-column gap-2" style={{ width: 540, height: 600 }}>
			<PopupHeader storage={storage} />

			<main className="h-100 d-flex flex-column justify-content-between">
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
