import { Alert, Col, Form, Row, Spinner, Stack } from "react-bootstrap";
import Browser from "webextension-polyfill";
import BrowserStorage from "../../../../BrowserStorage";
import CatalogItemsDetailsAccordions from "../../CatalogItemsDetailsAccordions";

const CatalogItemsAutoBuyerTab: React.FC<{
	storage: [
		BrowserStorage,
		React.Dispatch<React.SetStateAction<BrowserStorage>>,
	];
}> = ({ storage: [storage, setstorage] }) => {
	return (
		<Stack>
			<div className="fs-3 text-dark">Features</div>
			<Stack className="border rounded">
				<Form.Switch
					type="switch"
					label="Autobuyer"
					defaultChecked={
						storage.autoBuyerCatalogItemsDetailsEnabled === null ||
						storage.autoBuyerCatalogItemsDetailsEnabled
					}
					onChange={(event) => {
						setstorage({
							...storage,
							autoBuyerCatalogItemsDetailsEnabled: event.target.checked,
						});

						if (event.target.checked) {
							Browser.storage.local.set({
								autoBuyerCatalogItemsDetailsEnabled: event.target.checked,
							} as BrowserStorage);
						} else {
							setstorage({
								...storage,
								autoBuyerCatalogItemsDetails: [],
								autoBuyerCatalogItemsDetailsEnabled: false,
							});

							Browser.storage.local.set({
								autoBuyerCatalogItemsDetails: [] as any[],
								autoBuyerCatalogItemsDetailsEnabled: false,
							} as BrowserStorage);
						}
					}}
				/>

				<Form.Switch
					type="switch"
					label="Notifications"
					defaultChecked={storage.autoBuyerCatalogItemsDetailsNotification}
					onChange={(event) => {
						setstorage({
							...storage,
							autoBuyerCatalogItemsDetailsNotification: event.target.checked,
						});

						Browser.storage.local.set({
							autoBuyerCatalogItemsDetailsNotification: event.target.checked,
						});
					}}
				/>
			</Stack>

			<div className="fs-3 text-dark">Purchase</div>
			<Stack className="border rounded">
				<Form.Label>Purchase per minute</Form.Label>

				<Row>
					<Col xs={2}>
						<input
							className="w-100 text-center rounded border"
							type="number"
							step={1}
							value={storage.purchasesMultiplier}
							max={12}
							min={1}
							onChange={(event) => {
								Browser.storage.local.set({
									purchasesMultiplier: Number.parseInt(event.target.value),
								} as BrowserStorage);
							}}
						/>
					</Col>

					<Col>
						<Form.Range
							value={storage.purchasesMultiplier}
							max={12}
							min={1}
							onChange={(event) => {
								Browser.storage.local.set({
									purchasesMultiplier: Number.parseInt(event.target.value),
								} as BrowserStorage);
							}}
						/>
					</Col>
				</Row>
			</Stack>

			<Alert
				variant="light"
				dismissible
				hidden={
					!(
						storage.autoBuyerCatalogItemsDetailsEnabled === null ||
						(storage.autoBuyerCatalogItemsDetails.length > 1 &&
							storage.autoBuyerCatalogItemsDetailsEnabled)
					)
				}
			>
				<Alert.Heading>
					<Row className="fs-3 p-1 d-flex align-items-center">
						<Col className="text-center" xs={2}>
							<Spinner />
						</Col>

						<Col xs={9}>
							{[
								"Autobuyer is enabled by default",
								"Autobuyer is running on background",
								"You'll be notified when new items are available",
								"Avoid manually purchase while Autobuyer is enabled",
							].find((_, i, c) => Math.random() < 1 / (c.length - i))}
							.
						</Col>
					</Row>
				</Alert.Heading>
			</Alert>

			<CatalogItemsDetailsAccordions
				active={
					storage.autoBuyerCatalogItemsDetailsEnabled === null ||
					storage.autoBuyerCatalogItemsDetailsEnabled
				}
				data={storage.autoBuyerCatalogItemsDetails}
			/>
		</Stack>
	);
};

export default CatalogItemsAutoBuyerTab;
