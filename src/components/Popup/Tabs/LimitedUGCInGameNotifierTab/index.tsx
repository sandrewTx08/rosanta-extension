import Browser from "webextension-polyfill";
import BrowserStorage from "../../../../BrowserStorage";
import CatalogItemsLink from "../../../../roblox/CatalogItemsLink";
import { useEffect, useState } from "preact/hooks";

const LimitedUGCInGameTab = ({
	loading: [loading, setloading],
	storage: [storage, setstorage],
}: {
	loading: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
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
	}, [storage.limitedUGCInGameNotifierAssets, orderingtype]);

	return (
		<>
			<div className="d-flex flex-column p-3 gap-3">
				<div className="form-check form-switch">
					<input
						className="form-check-input"
						type="checkbox"
						role="switch"
						disabled={loading}
						checked={storage.limitedUGCInGameNotifierEnabled}
						onChange={(event) => {
							setloading(true);
							setstorage((value) => {
								value.limitedUGCInGameNotifierEnabled =
									event.target.checked || value.limitedUGCInGameNotifierEnabled;
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
									})
									.finally(() => {
										setloading(false);
									});
							}
						}}
					/>
					<label className="form-check-label">Notifier</label>
				</div>

				<div className="row">
					<div className="col-12 gap-2 d-flex">
						<input
							className="form-check-input"
							type="radio"
							checked={orderingtype == OrderingType.MOST_RECENT}
							onChange={(event) => {
								if (event.target.checked) {
									setorderingtype(OrderingType.MOST_RECENT);
								}
							}}
						/>
						<label className="form-check-label">Most recent</label>
					</div>

					<div className="col-12 gap-2 d-flex">
						<input
							className="form-check-input"
							type="radio"
							checked={orderingtype == OrderingType.MAX_AVAILABLE_UNITS}
							onChange={(event) => {
								if (event.target.checked) {
									setorderingtype(OrderingType.MAX_AVAILABLE_UNITS);
								}
							}}
						/>
						<label className="form-check-label">Available units</label>
					</div>
				</div>
			</div>

			<ul className="list-group list-group-flush text-break" style={{ border: 0 }}>
				{assets.map((data) => (
					<li className="list-group-item" key={data.productId}>
						<div>
							<a href={CatalogItemsLink.parseCatalogDetails(data)} target="_blank">
								{data.name}
							</a>
						</div>

						<div>
							<small>
								Units available: <b>{data.unitsAvailableForConsumption}</b>
								{" / "}
								<b>{data.totalQuantity}</b>
							</small>
						</div>

						<div>
							<small>
								<a className="text-black" href={data.gameURL} target="_blank">
									{data.gameURL}
								</a>
							</small>
						</div>
					</li>
				))}
			</ul>
		</>
	);
};

export default LimitedUGCInGameTab;
