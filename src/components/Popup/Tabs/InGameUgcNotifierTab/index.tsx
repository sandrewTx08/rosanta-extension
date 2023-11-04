import Browser from "webextension-polyfill";
import BrowserStorage from "../../../../BrowserStorage";
import { useState } from "preact/hooks";
import { Col, Form, ProgressBar, Row, Stack } from "react-bootstrap";
import CatalogItemsDetailsAccordions from "../../CatalogItemsDetailsAccordions";
import { Controller } from "react-bootstrap-icons";

const InGameUgcNotifierTab: React.FC<{
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
		...storage.ugcInGameNotifier.map(
			({ unitsAvailableForConsumption }) => unitsAvailableForConsumption,
		),
		0,
	);

	const [orderingtype, setorderingtype] = useState(OrderingType.MOST_RECENT);
	const [quantitymin, setquantitymin] = useState(0);

	return (
		<Stack>
			<div className="fs-3 text-dark">Features</div>
			<Stack className="border rounded">
				<Form.Switch
					type="switch"
					label="Notifier"
					defaultChecked={storage.ugcInGameNotifierEnabled}
					onChange={(event) => {
						setstorage({
							...storage,
							ugcInGameNotifierEnabled: event.target.checked,
						});

						if (event.target.checked) {
							Browser.storage.local.set({
								ugcInGameNotifierEnabled: event.target.checked,
							} as BrowserStorage);
						} else {
							setstorage({
								...storage,
								ugcInGameNotifier: [],
								ugcInGameNotifierEnabled: false,
							});

							Browser.storage.local.set({
								ugcInGameNotifier: [] as any[],
								ugcInGameNotifierEnabled: false,
							} as BrowserStorage);
						}
					}}
				/>
			</Stack>

			<div className="fs-3 text-dark">Filtering</div>
			<Stack className="border rounded">
				<Form.Check
					type="radio"
					label="Most recent"
					checked={orderingtype == OrderingType.MOST_RECENT}
					defaultChecked={orderingtype == OrderingType.MOST_RECENT}
					onChange={() => {
						setorderingtype(OrderingType.MOST_RECENT);
					}}
				/>

				<Form.Check
					disabled={storage.ugcInGameNotifier.length < 1}
					type="radio"
					label="Best matches"
					checked={orderingtype == OrderingType.BEST_MATCH}
					defaultChecked={orderingtype == OrderingType.BEST_MATCH}
					onChange={() => {
						setorderingtype(OrderingType.BEST_MATCH);
					}}
				/>
			</Stack>

			<div className="fs-3 text-dark">Quantity</div>
			<Stack className="border rounded">
				<Row>
					<Col xs={3} className="text-center">
						<input
							disabled={quantitymax < 1}
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
							disabled={quantitymax < 1}
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

			<CatalogItemsDetailsAccordions
				data={(() => {
					switch (orderingtype) {
						case OrderingType.BEST_MATCH:
							storage.ugcInGameNotifier = storage.ugcInGameNotifier
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
							break;

						default:
						case OrderingType.MOST_RECENT:
							storage.ugcInGameNotifier = storage.ugcInGameNotifier;
							break;
					}

					return storage.ugcInGameNotifier.filter(
						({ unitsAvailableForConsumption }) =>
							unitsAvailableForConsumption > quantitymin,
					);
				})()}
				active={storage.ugcInGameNotifierEnabled}
				headerRight={(data) => (
					<>
						{data.gameURL && (
							<a href={data.gameURL} target="_blank">
								<Controller className="p-1 rounded-circle icon-fill" size={25} />
							</a>
						)}

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
						{data.gameURL && (
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
							</>
						)}
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

export default InGameUgcNotifierTab;
