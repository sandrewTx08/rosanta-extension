import { Row, Col } from "react-bootstrap";
import BrowserStorage from "../../BrowserStorage";
import { ArrowRepeat } from "react-bootstrap-icons";
import Browser from "webextension-polyfill";

const PopupHeader: React.FC<{
	storage: [
		BrowserStorage,
		React.Dispatch<React.SetStateAction<BrowserStorage>>,
	];
}> = ({ storage: [storage, setstorage] }) => {
	return (
		<header className="pb-1 pt-2 px-4" style={{ height: 180 }}>
			<Row>
				<Col>
					<Row className="text-center">
						<Col xs={12}>
							<a
								target="_black"
								className="d-block w-auto h-100"
								href="https://github.com/sandrewTx08/rosanta-extension"
								rel="noopener noreferrer"
							>
								<img width={120} className="h-100" src="icon.png" />
							</a>
						</Col>

						<Col xs={12} className="fs-4">
							<ArrowRepeat
								className="m-2"
								onClick={() => {
									setstorage(BrowserStorage.INITIAL_STORAGE);

									Browser.storage.local.set(BrowserStorage.INITIAL_STORAGE);
								}}
							/>
							Reload extension
						</Col>
					</Row>
				</Col>

				{storage.avatarHeadshot && (
					<Col className="mt-auto" xs={6}>
						<Row className="text-center gy-2">
							<Col xs={12}>
								<a
									className="rounded h-100 link-warning"
									href={`https://www.roblox.com/users/${storage.robloxUser?.id}/profile`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<img
										width={120}
										className="rounded shadow-sm h-100"
										src={storage.avatarHeadshot.data[0].imageUrl}
										alt="Error loading avatar image"
									/>
								</a>
							</Col>

							<Col className="text-truncate" xs={12}>
								<b>{storage.robloxUser?.displayName}</b>
							</Col>
						</Row>
					</Col>
				)}
			</Row>
		</header>
	);
};

export default PopupHeader;
