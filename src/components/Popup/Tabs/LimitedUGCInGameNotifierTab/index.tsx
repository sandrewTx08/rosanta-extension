import Browser from "webextension-polyfill";
import BrowserStorage from "../../../../BrowserStorage";
import { useState } from "preact/hooks";
import { Col, Form, ProgressBar, Row, Stack } from "react-bootstrap";
import CatalogItemsAccordions from "../../CatalogItemsAccordions";
import { Controller } from "react-bootstrap-icons";

const LimitedUGCInGameTab: React.FC<{
	storage: [
		BrowserStorage,
		React.Dispatch<React.SetStateAction<BrowserStorage>>,
	];
}> = ({ storage: [storage, setstorage] }) => {
	enum OrderingType {
		MOST_RECENT,
		BEST_MATCH,
	}

	const quantitymax = Math.max(
		...storage.limitedUGCInGameNotifierAssets.map(
			({ unitsAvailableForConsumption }) => unitsAvailableForConsumption,
		),
		0,
	);

	const [orderingtype, setorderingtype] = useState(OrderingType.MOST_RECENT);
	const [quantitymin, setquantitymin] = useState(0);

	return (
		<Stack gap={2}>
			<h3 className="text-dark">Features</h3>
			<Stack className="border p-3 rounded">
				<Form.Switch
					type="switch"
					label="Notifier"
					defaultChecked={storage.limitedUGCInGameNotifierEnabled}
					onChange={(event) => {
						setstorage({
							...storage,
							limitedUGCInGameNotifierEnabled: event.target.checked,
						});

						if (event.target.checked) {
							Browser.storage.local
								.set({
									limitedUGCInGameNotifierEnabled: event.target.checked,
								} as BrowserStorage)
								.catch(() => {
									setstorage({
										...storage,
										limitedUGCInGameNotifierEnabled:
											!storage.limitedUGCInGameNotifierEnabled,
									});
								});
						} else {
							setstorage({
								...storage,
								limitedUGCInGameNotifierEnabled: false,
							});

							Browser.storage.local.set({
								limitedUGCInGameNotifierEnabled: false,
							} as BrowserStorage);
						}
					}}
				/>
			</Stack>

			<h3 className="text-dark">Filtering</h3>
			<Stack className="border p-3 rounded">
				<Form.Check
					type="radio"
					label="Most recent"
					checked={orderingtype == OrderingType.MOST_RECENT}
					defaultChecked={orderingtype == OrderingType.MOST_RECENT}
					onChange={(event) => {
						if (event.target.checked) {
							setorderingtype(OrderingType.MOST_RECENT);
						}
					}}
				/>

				<Form.Check
					disabled={storage.limitedUGCInGameNotifierAssets.length <= 0}
					type="radio"
					label="Best matches"
					checked={orderingtype == OrderingType.BEST_MATCH}
					defaultChecked={orderingtype == OrderingType.BEST_MATCH}
					onChange={(event) => {
						if (event.target.checked) {
							setorderingtype(OrderingType.BEST_MATCH);
						}
					}}
				/>
			</Stack>

			<h3 className="text-dark">Quantity</h3>
			<Stack className="border p-3 rounded">
				<Row>
					<Col xs={3} className="text-center">
						<input
							className="w-100 border text-center rounded"
							type="number"
							step={1}
							value={quantitymin}
							min={0}
							onChange={(event) => {
								setTimeout(() => {
									setquantitymin(Number.parseInt(event.target.value));
								}, 1000);
							}}
						/>
					</Col>
					<Col xs={7}>
						<Form.Range
							defaultValue={quantitymin}
							onChange={(event) => {
								setquantitymin(Number.parseInt(event.target.value));
							}}
							max={quantitymax}
						/>
					</Col>
					<Col xs={2} className="text-center">
						{quantitymax}
					</Col>
				</Row>
			</Stack>

			<CatalogItemsAccordions
				data={((
					data: BrowserStorage["limitedUGCInGameNotifierAssets"],
				): BrowserStorage["limitedUGCInGameNotifierAssets"] => {
					data = data.filter(
						({ unitsAvailableForConsumption }) =>
							unitsAvailableForConsumption >= quantitymin,
					);

					switch (orderingtype) {
						case OrderingType.BEST_MATCH:
							return data
								.filter(
									({ unitsAvailableForConsumption, totalQuantity = 0 }) =>
										unitsAvailableForConsumption - totalQuantity != 0,
								)
								.sort(
									(
										{ unitsAvailableForConsumption: asc1, totalQuantity: asc2 = 0 },
										{ unitsAvailableForConsumption: desc1, totalQuantity: desc2 = 0 },
									) => desc1 + desc2 - (asc1 + asc2),
								);

						default:
						case OrderingType.MOST_RECENT:
							return data;
					}
				})(storage.limitedUGCInGameNotifierAssets)}
				active={storage.limitedUGCInGameNotifierEnabled}
				headerRight={(data) => (
					<>
						<a href={data.gameURL} target="_blank">
							<Controller className="p-1 rounded-circle icon-fill" size={25} />
						</a>

						<ProgressBar className="w-100 small" max={data.totalQuantity}>
							<ProgressBar
								variant="danger"
								now={(data.totalQuantity || 0) - data.unitsAvailableForConsumption}
								title={(
									(data.totalQuantity || 0) - data.unitsAvailableForConsumption
								).toString()}
							/>
							<ProgressBar
								variant="success"
								now={data.unitsAvailableForConsumption}
								title={data.unitsAvailableForConsumption.toString()}
							/>
						</ProgressBar>
					</>
				)}
				body={(data) => (
					<>
						<Col xs={3}>Game</Col>
						<Col xs={9}>
							<a
								className="link-dark text-trucante text-break"
								href={data.gameURL}
								target="_blank"
							>
								{data.gameURL}
							</a>
						</Col>
						<Col xs={3}>Available</Col>
						<Col xs={9}>
							<ProgressBar max={data.totalQuantity}>
								<ProgressBar
									variant="danger"
									now={(data.totalQuantity || 0) - data.unitsAvailableForConsumption}
									label={(data.totalQuantity || 0) - data.unitsAvailableForConsumption}
								/>
								<ProgressBar
									variant="success"
									now={data.unitsAvailableForConsumption}
									label={data.unitsAvailableForConsumption}
								/>
							</ProgressBar>
						</Col>
					</>
				)}
			/>
		</Stack>
	);
};

export default LimitedUGCInGameTab;
