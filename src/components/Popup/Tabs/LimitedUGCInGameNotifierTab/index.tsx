import Browser from "webextension-polyfill";
import BrowserStorage from "../../../../BrowserStorage";
import { useEffect, useState } from "preact/hooks";
import CatalogItemsLink from "../../../../roblox/roblox-catalog/CatalogItemsLink";
import { Row, Col, Card, Form, ProgressBar } from "react-bootstrap";
import CardPlaceHolder from "../../CardPlaceHolder";

const LimitedUGCInGameTab = ({
	storage: [storage, setstorage],
}: {
	storage: [
		BrowserStorage,
		React.Dispatch<React.SetStateAction<BrowserStorage>>,
	];
}) => {
	enum OrderingType {
		MAX_AVAILABLE_UNITS,
		MOST_RECENT,
	}

	const [orderingtype, setorderingtype] = useState(OrderingType.MOST_RECENT);
	const [assets, setassets] = useState(storage.limitedUGCInGameNotifierAssets);

	useEffect(() => {
		setassets((value) => [
			...(orderingtype == OrderingType.MOST_RECENT
				? storage.limitedUGCInGameNotifierAssets
				: value.sort(
						(
							{ unitsAvailableForConsumption: asc },
							{ unitsAvailableForConsumption: desc },
						) => desc - asc,
				  )),
		]);
	}, [
		storage.limitedUGCInGameNotifierAssets,
		orderingtype,
		storage.limitedUGCInGameNotifierEnabled,
	]);

	return (
		<div className="p-3 d-flex flex-column gap-3">
			<Form.Switch
				type="switch"
				label="Notifier"
				checked={storage.limitedUGCInGameNotifierEnabled}
				onChange={(event) => {
					setstorage((value) => {
						value.limitedUGCInGameNotifierEnabled = event.target.checked;
						return { ...value };
					});

					if (event.target.checked) {
						Browser.storage.local
							.set({
								limitedUGCInGameNotifierEnabled: event.target.checked,
							} as BrowserStorage)
							.then(() => {
								setstorage((value) => {
									value.limitedUGCInGameNotifierEnabled = event.target.checked;
									return { ...value };
								});
							})
							.catch(() => {
								setstorage((value) => {
									value.limitedUGCInGameNotifierEnabled =
										!value.limitedUGCInGameNotifierEnabled;
									return { ...value };
								});
							});
					} else {
						Browser.storage.local
							.set({
								limitedUGCInGameNotifierAssets: [] as any[],
								limitedUGCInGameNotifierEnabled: false,
							} as BrowserStorage)
							.then(() => {
								setstorage((value) => {
									value.limitedUGCInGameNotifierAssets = [];
									return { ...value };
								});
							});
					}
				}}
			/>

			<div className="d-flex gap-2">
				<Form.Check
					inline
					type="radio"
					label="Most recent"
					checked={orderingtype == OrderingType.MOST_RECENT}
					onChange={(event) => {
						if (event.target.checked) {
							setorderingtype(OrderingType.MOST_RECENT);
						}
					}}
				/>

				<Form.Check
					inline
					type="radio"
					label="Available units"
					checked={orderingtype == OrderingType.MAX_AVAILABLE_UNITS}
					onChange={(event) => {
						if (event.target.checked) {
							setorderingtype(OrderingType.MAX_AVAILABLE_UNITS);
						}
					}}
				/>
			</div>

			<Row xs={4} className="g-1 p-1">
				{assets.length > 0
					? assets.map((data) => (
							<Col key={data.id} className="small">
								<Card className="h-100 small">
									<a href={CatalogItemsLink.parseCatalogDetails(data)} target="_blank">
										<Card.Img
											variant="top"
											src={data.imageBatch?.imageUrl || "icon.png"}
										/>
									</a>
									<Card.Body>
										<Card.Title>{data.name}</Card.Title>
										<Card.Text>
											<a className="text-black" href={data.gameURL} target="_blank">
												{data.gameURL}
											</a>
										</Card.Text>
									</Card.Body>
									<Card.Footer className="d-flex justify-content-around">
										<b>{data.unitsAvailableForConsumption}</b>
										{" / "}
										<b>{data.totalQuantity}</b>
									</Card.Footer>
									<Card.Footer>
										<ProgressBar
											max={100}
											now={
												100 -
												(data.unitsAvailableForConsumption * 100) /
													(data.totalQuantity || 0)
											}
										/>
									</Card.Footer>
								</Card>
							</Col>
					  ))
					: storage.limitedUGCInGameNotifierEnabled &&
					  Array.from({ length: 6 }).map(() => (
							<Col>
								<CardPlaceHolder />
							</Col>
					  ))}
			</Row>
		</div>
	);
};

export default LimitedUGCInGameTab;
