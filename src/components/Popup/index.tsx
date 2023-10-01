import { useEffect, useState } from "preact/hooks";
import Browser from "webextension-polyfill";
import "../../../index.scss";
import BrowserStorage from "../../BrowserStorage";
import { Tab, Tabs } from "react-bootstrap";
import CatalogItemsAutoBuyerTab from "./Tabs/CatalogItemsAutoBuyerTab";
import LimitedUGCInGameNotifier from "./Tabs/LimitedUGCInGameNotifierTab";
import { robloxUserService } from "../../roblox";

const Popup = () => {
	enum TabEventKeys {
		AUTOBUYER,
		UGC,
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
		<div className="d-flex flex-column gap-2" style={{ width: 540, height: 600 }}>
			<header
				className="d-flex gap-4 justify-content-center pb-4 pt-2"
				style={{ height: 180 }}
			>
				<img className="h-100 w-auto" src="icon.png" />

				{storage.avatarHeadshot && (
					<div className="d-flex shadow-sm flex-column gap-2 text-center">
						<a
							className="d-block w-100 h-100"
							href={`https://www.roblox.com/users/${storage.robloxUser?.id}/profile`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								className="rounded w-100 h-100"
								src={storage.avatarHeadshot.data[0].imageUrl}
								alt=""
							/>
						</a>

						<b>{storage.robloxUser?.displayName}</b>
					</div>
				)}
			</header>

			<div className="h-100 d-flex flex-column justify-content-between">
				<main>
					<Tabs defaultActiveKey={TabEventKeys.AUTOBUYER} justify>
						<Tab eventKey={TabEventKeys.AUTOBUYER} title="Auto buyer">
							<CatalogItemsAutoBuyerTab
								loading={[loading, setloading]}
								storage={[storage, setstorage]}
							/>
						</Tab>
						<Tab eventKey={TabEventKeys.UGC} title="UGC notifier">
							<LimitedUGCInGameNotifier
								loading={[loading, setloading]}
								storage={[storage, setstorage]}
							/>
						</Tab>
					</Tabs>
				</main>

				<footer className="bg-primary d-flex gap-3 py-2 px-4 justify-content-center">
					<a
						className="text-white text-decoration-none"
						href="https://www.roblox.com/my/avatar"
						target="_blank"
						rel="noopener noreferrer"
					>
						Avatar
					</a>

					<a
						target="_black"
						className="text-white text-decoration-none"
						href="https://github.com/sandrewTx08/rosanta-extension"
					>
						Homepage
					</a>

					<a
						target="_black"
						className="text-white text-decoration-none"
						href="https://www.paypal.com/donate/?hosted_button_id=SLTU45DK5LFSS"
					>
						Donations
					</a>
				</footer>
			</div>
		</div>
	);
};

export default Popup;
