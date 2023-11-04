import { Col, Row } from "react-bootstrap";

const PopupFooter: React.FC = () => {
	return (
		<footer
			id="footer"
			className="mt-auto bg-light border-top d-flex gap-3 py-2 px-4 justify-content-center"
		>
			<Row>
				<Col>
					<a target="_black" href="https://github.com/sandrewTx08/rosanta-extension">
						<img style={{ height: 40 }} className="w-100" src="icon.png" />
					</a>
				</Col>
				<Col className="d-flex gap-4 align-items-center">
					<a
						href="https://www.roblox.com/my/avatar"
						target="_blank"
						rel="noopener noreferrer"
					>
						Avatar
					</a>

					<a target="_black" href="https://github.com/sandrewTx08/rosanta-extension">
						Homepage
					</a>

					<a
						target="_black"
						href="https://www.paypal.com/donate/?hosted_button_id=SLTU45DK5LFSS"
					>
						Donations
					</a>
				</Col>
			</Row>
		</footer>
	);
};

export default PopupFooter;
