import { Col, Form, ProgressBar, Row, Spinner, Stack } from "react-bootstrap";
import Browser from "webextension-polyfill";
import BrowserStorage from "../../../../BrowserStorage";
import CatalogItemsAccordions from "../../CatalogItemsAccordions";

const CatalogItemsAutoBuyerTab = ({
	storage: [storage, setstorage],
}: {
	storage: [
		BrowserStorage,
		React.Dispatch<React.SetStateAction<BrowserStorage>>,
	];
}) => {
	const progress =
		((storage.catalogItemsAutoBuyerAssetsTotal -
			storage.catalogItemsAutoBuyerAssets.length) *
			100) /
			storage.catalogItemsAutoBuyerAssetsTotal || 0;

	return (
		<Stack gap={3}>
			<Form.Switch
				type="switch"
				label="Autobuyer"
				defaultChecked={storage.catalogItemsAutoBuyerEnabled}
				onChange={(event) => {
					setstorage({
						...storage,
						catalogItemsAutoBuyerEnabled: event.target.checked,
					});

					if (event.target.checked) {
						Browser.storage.local
							.set({
								catalogItemsAutoBuyerEnabled: event.target.checked,
							})
							.catch(() => {
								setstorage({
									...storage,
									catalogItemsAutoBuyerEnabled: !storage.catalogItemsAutoBuyerEnabled,
								});
							});
					} else {
						setstorage({
							...storage,
							catalogItemsAutoBuyerAssets: [],
							catalogItemsAutoBuyerEnabled: false,
						});

						Browser.storage.local.set({
							catalogItemsAutoBuyerAssets: [] as any[],
							catalogItemsAutoBuyerEnabled: false,
						} as BrowserStorage);
					}
				}}
			/>

			<Form.Switch
				type="switch"
				label="Notifications"
				defaultChecked={storage.catalogItemsAutoBuyerNotification}
				onChange={(event) => {
					setstorage({
						...storage,
						catalogItemsAutoBuyerNotification: event.target.checked,
					});

					Browser.storage.local.set({
						catalogItemsAutoBuyerNotification: event.target.checked,
					});
				}}
			/>

			<ProgressBar
				style={{ height: 26 }}
				now={progress}
				label={progress.toFixed(0) + "%"}
				hidden={storage.catalogItemsAutoBuyerAssets.length <= 0}
			/>

			{storage.catalogItemsAutoBuyerAssets.length <= 0 &&
				storage.catalogItemsAutoBuyerEnabled && (
					<Row className="fs-3 d-flex gap-4 align-items-center p-1">
						<Col xs={1}>
							<Spinner />
						</Col>
						<Col xs={10}>
							{[
								"Community is creating new awesome items",
								"RoSanta is searching for new items, wait",
								"You'll be notified when new items are available",
							].find((_, i, c) => Math.random() < 1 / (c.length - i))}
							.
						</Col>
					</Row>
				)}

			<CatalogItemsAccordions
				active={storage.catalogItemsAutoBuyerEnabled}
				data={storage.catalogItemsAutoBuyerAssets}
			/>
		</Stack>
	);
};

export default CatalogItemsAutoBuyerTab;
