import { Row, Col } from "react-bootstrap";
import BrowserStorage from "../../BrowserStorage";
import { ArrowRepeat } from "react-bootstrap-icons";
import Browser from "webextension-polyfill";

const PopupHeader: React.FC<{ storage: BrowserStorage }> = ({ storage }) => {
	return (
		<header id="header" className="py-2 px-4 bg-light">
			<Row>
				<Col className="mx-auto" xs={6}>
					<Row className="text-center">
						<Col xs={12}>
							<a
								target="_black"
								href="https://github.com/sandrewTx08/rosanta-extension"
								rel="noopener noreferrer"
							>
								<img className="img-fluid" src="icon.png" />
							</a>
						</Col>

						<Col xs={12} className="fs-4">
							<ArrowRepeat
								className="m-2"
								onClick={() => {
									Browser.storage.local.set(BrowserStorage.INITIAL_STORAGE);
									window.location.reload();
									Browser.permissions.request({ origins: ["*://*.roblox.com/*"] });
								}}
							/>
							Reload extension
						</Col>
					</Row>
				</Col>

				<Col hidden={!storage.robloxUser?.id} className="mt-auto" xs={6}>
					{storage.avatarHeadshot && (
						<Row className="text-center gy-2">
							<Col xs={12}>
								<a
									className="rounded link-warning"
									href={`https://www.roblox.com/users/${storage.robloxUser?.id}/profile`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<img
										className="rounded shadow-sm img-fluid"
										src={storage.avatarHeadshot.data[0].imageUrl}
										alt="Error loading avatar image"
									/>
								</a>
							</Col>

							<Col className="text-truncate" xs={12}>
								<b>{storage.robloxUser?.displayName}</b>
							</Col>
						</Row>
					)}
				</Col>
			</Row>
		</header>
	);
};

export default PopupHeader;
