import { Card, Col, Form, ProgressBar, Row, Spinner } from "react-bootstrap";
import Browser from "webextension-polyfill";
import BrowserStorage from "../../../../BrowserStorage";
import CatalogItemsLink from "../../../../roblox/roblox-catalog/CatalogItemsLink";
import CardPlaceHolder from "../../CardPlaceHolder";

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
		<div className="p-3 d-flex flex-column gap-3">
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

			<Row xs={4} className="g-1 p-1">
				{storage.catalogItemsAutoBuyerAssets.length > 0
					? storage.catalogItemsAutoBuyerAssets.map((data, i) => (
							<Col key={data.id} className="small">
								<Card className="h-100 small" border={i == 0 ? "primary" : undefined}>
									<a href={CatalogItemsLink.parseCatalogDetails(data)} target="_blank">
										<Card.Img
											variant="top"
											src={data.imageBatch?.imageUrl || "icon.png"}
										/>
									</a>
									<Card.Body>
										<Card.Title>{data.name}</Card.Title>
										<Card.Text className="text-truncate">{data.description}</Card.Text>
									</Card.Body>
								</Card>
							</Col>
					  ))
					: storage.catalogItemsAutoBuyerEnabled && (
							<>
								{Array.from({ length: 6 }).map(() => (
									<Col>
										<CardPlaceHolder />
									</Col>
								))}
							</>
					  )}
			</Row>
		</div>
	);
};

export default CatalogItemsAutoBuyerTab;
