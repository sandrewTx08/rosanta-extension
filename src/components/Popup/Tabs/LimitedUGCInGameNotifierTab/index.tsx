import Browser from "webextension-polyfill";
import BrowserStorage from "../../../../BrowserStorage";
import { useState } from "preact/hooks";
import { Col, Form, ProgressBar, Row, Stack } from "react-bootstrap";
import CatalogItemsAccordions from "../../CatalogItemsAccordions";
import { Controller } from "react-bootstrap-icons";

const LimitedUGCInGameTab = ({
	storage: [storage, setstorage],
}: {
	storage: [
		BrowserStorage,
		React.Dispatch<React.SetStateAction<BrowserStorage>>,
	];
}) => {
	enum OrderingType {
		MOST_RECENT,
		BEST_MATCH,
	}

	const availablequantitytotalmax = Math.max(
		...storage.limitedUGCInGameNotifierAssets.map(
			({ unitsAvailableForConsumption }) => unitsAvailableForConsumption,
		),
		0,
	);

	const [orderingtype, setorderingtype] = useState(OrderingType.MOST_RECENT);
	const [minquantity, setminquantity] = useState(200);

	return (
		<Stack gap={3}>
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

			<div className="d-flex gap-2">
				<Form.Check
					inline
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
					inline
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
			</div>

			<Form.Label>Total quantity</Form.Label>

			<Row>
				<Col xs={2} className="text-center">
					{minquantity}
				</Col>
				<Col xs={8}>
					<Form.Range
						defaultValue={minquantity}
						onChange={(event) => {
							setminquantity(Number.parseInt(event.target.value));
						}}
						max={availablequantitytotalmax}
					/>
				</Col>
				<Col xs={2} className="text-center">
					{availablequantitytotalmax}
				</Col>
			</Row>

			<CatalogItemsAccordions
				data={((
					data: BrowserStorage["limitedUGCInGameNotifierAssets"],
				): BrowserStorage["limitedUGCInGameNotifierAssets"] => {
					data = data.filter(
						({ unitsAvailableForConsumption }) =>
							unitsAvailableForConsumption >= minquantity,
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
				headerLeft={(data) => (
					<a href={data.gameURL} target="_blank">
						<Controller className="text-center" />
					</a>
				)}
				body={(data) => (
					<>
						<Col xs={3}>Game</Col>
						<Col xs={9}>
							<a
								className="text-black text-trucante text-break"
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
