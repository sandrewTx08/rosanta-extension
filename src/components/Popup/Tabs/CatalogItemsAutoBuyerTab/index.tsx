import { Accordion, Card, Col, Form, ProgressBar, Row } from "react-bootstrap";
import Browser from "webextension-polyfill";
import CatalogItemsDetailsQueryParamDTO from "../../../../roblox/roblox-catalog/CatalogItemsDetailsQueryParamDTO";
import BrowserStorage from "../../../../BrowserStorage";
import CatalogItemsLink from "../../../../roblox/roblox-catalog/CatalogItemsLink";

const CatalogItemsAutoBuyerTab = ({
	loading: [loading, setloading],
	storage: [storage, setstorage],
}: {
	loading: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
	storage: [
		BrowserStorage,
		React.Dispatch<React.SetStateAction<BrowserStorage>>,
	];
}) => {
	const disableOptions = loading || storage.sniperModeAutoBuyerEnabled;

	const progress =
		((storage.catalogItemsAutoBuyerAssetsTotal -
			storage.catalogItemsAutoBuyerAssets.length) *
			100) /
			storage.catalogItemsAutoBuyerAssetsTotal || 0;

	return (
		<>
			<div className="p-3 d-flex flex-column gap-3">
				<div className="form-check form-switch">
					<input
						className="form-check-input"
						type="checkbox"
						role="switch"
						disabled={loading}
						checked={storage.sniperModeAutoBuyerEnabled}
						onChange={(event) => {
							const data = {
								sniperModeAutoBuyerEnabled: event.target.checked,
								catalogItemsAutoBuyerTotalPages: 2,
								catalogItemsAutoBuyerLimit: 30,
								catalogItemsAutoBuyerEnabled: true,
							} as BrowserStorage;

							setstorage((value) => {
								return { ...value, ...data };
							});

							if (event.target.checked) {
								Browser.storage.local
									.set({
										...data,
										sniperModeAutoBuyerEnabled: event.target.checked,
									} as BrowserStorage)
									.catch(() => {
										setstorage((value) => {
											value.sniperModeAutoBuyerEnabled = !value.sniperModeAutoBuyerEnabled;
											return { ...value };
										});
									});
							} else {
								Browser.storage.local.set({
									sniperModeAutoBuyerEnabled: event.target.checked,
								} as BrowserStorage);
							}
						}}
					/>
					<label className="form-check-label">
						Sniper mode <b>NEW!</b>
					</label>
				</div>

				<div className="form-check form-switch">
					<input
						className="form-check-input"
						disabled={loading}
						type="checkbox"
						checked={storage.catalogItemsAutoBuyerNotification}
						onChange={(event) => {
							setstorage((value) => {
								value.catalogItemsAutoBuyerNotification = event.target.checked;
								return { ...value };
							});

							Browser.storage.local.set({
								catalogItemsAutoBuyerNotification: event.target.checked,
							});
						}}
					/>
					<label className="form-check-label">Notifications</label>
				</div>

				<Accordion alwaysOpen={false}>
					<Accordion.Item eventKey="0">
						<Accordion.Header>Options</Accordion.Header>
						<Accordion.Body className="d-flex flex-column gap-2">
							<div className="form-check form-switch">
								<input
									className="form-check-input"
									type="checkbox"
									role="switch"
									disabled={disableOptions}
									checked={storage.catalogItemsAutoBuyerEnabled}
									onChange={(event) => {
										setloading(true);
										setstorage((value) => {
											value.catalogItemsAutoBuyerEnabled = event.target.checked;
											return { ...value };
										});

										if (event.target.checked) {
											Browser.storage.local
												.set({
													catalogItemsAutoBuyerEnabled: event.target.checked,
												})
												.then(() => {
													setstorage((value) => {
														value.catalogItemsAutoBuyerEnabled = event.target.checked;
														return { ...value };
													});
												})
												.catch(() => {
													setstorage((value) => {
														value.catalogItemsAutoBuyerEnabled =
															!value.catalogItemsAutoBuyerEnabled;
														return { ...value };
													});
												});
										} else {
											Browser.storage.local
												.set({
													catalogItemsAutoBuyerAssets: [] as any[],
													catalogItemsAutoBuyerEnabled: false,
												} as BrowserStorage)
												.then(() => {
													setstorage((value) => {
														value.catalogItemsAutoBuyerAssets = [];
														return { ...value };
													});
												})
												.finally(() => {
													setloading(false);
												});
										}
									}}
								/>
								<label className="form-check-label">Auto-buyer</label>
							</div>

							<Form.Label>
								Total of pages
								{storage.catalogItemsAutoBuyerTotalPages > 0 && (
									<>
										: <b>{storage.catalogItemsAutoBuyerTotalPages}</b>
									</>
								)}
							</Form.Label>

							<Form.Range
								min={1}
								disabled={disableOptions}
								value={storage.catalogItemsAutoBuyerTotalPages}
								max={BrowserStorage.INITIAL_STORAGE.catalogItemsAutoBuyerTotalPages}
								onChange={(event) => {
									const range = Number.parseInt(event.target.value);

									setstorage((value) => {
										value.catalogItemsAutoBuyerTotalPages = range;
										return { ...value };
									});

									Browser.storage.local.set({
										catalogItemsAutoBuyerTotalPages: range,
									});
								}}
							/>

							<div className="row">
								{([10, 30, 60, 120] as CatalogItemsDetailsQueryParamDTO["limit"][]).map(
									(data) => (
										<div className="col d-flex gap-2">
											<input
												className="form-check-input"
												type="radio"
												disabled={disableOptions}
												checked={storage.catalogItemsAutoBuyerLimit == data}
												onChange={() => {
													setloading(true);
													setstorage((value) => {
														value.catalogItemsAutoBuyerLimit = data;
														return { ...value };
													});

													Browser.storage.local
														.set({ catalogItemsAutoBuyerLimit: data } as BrowserStorage)
														.finally(() => {
															setloading(false);
														});
												}}
											/>
											<label className="form-check-label">
												<small>{data}</small>
											</label>
										</div>
									),
								)}
							</div>

							<span>
								<button
									type="button"
									className="btn btn-sm btn-warning rounded-pill"
									disabled={storage.catalogItemsAutoBuyerAssets.length <= 0}
									onClick={() => {
										setloading(true);

										Browser.storage.local
											.set({
												catalogItemsAutoBuyerAssets: [],
											})
											.then(() => {
												setstorage((value) => {
													value.catalogItemsAutoBuyerAssets = [];
													return { ...value };
												});
											})
											.finally(() => {
												setloading(false);
											});
									}}
								>
									Reset
								</button>
							</span>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

				<ProgressBar now={progress} label={progress.toFixed(0) + "%"} animated />
			</div>

			<Row xs={4} className="g-1 p-1">
				{storage.catalogItemsAutoBuyerAssets.map((data, i) => (
					<Col key={data.id}>
						<Card className="h-100" border={i == 0 ? "primary" : undefined}>
							<a href={CatalogItemsLink.parseCatalogDetails(data)} target="_blank">
								<Card.Img variant="top" src={data.imageBatch?.imageUrl || "icon.png"} />
							</a>
							<Card.Body>
								<Card.Title>{data.name}</Card.Title>
								<Card.Text className="text-truncate">{data.description}</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
		</>
	);
};

export default CatalogItemsAutoBuyerTab;
