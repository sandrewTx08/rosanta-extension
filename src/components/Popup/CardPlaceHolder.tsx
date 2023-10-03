import React from "react";
import { Card, Placeholder } from "react-bootstrap";

const CardPlaceHolder: React.FC = () => {
	return (
		<Card>
			<Card.Img variant="top" />
			<Card.Body>
				<Placeholder as={Card.Title} animation="glow">
					<Placeholder xs={Math.floor(Math.random() * 7) + 1} />
				</Placeholder>
				<Placeholder as={Card.Text} animation="glow">
					<Placeholder xs={Math.floor(Math.random() * 7) + 1} />
					<Placeholder xs={Math.floor(Math.random() * 7) + 1} />
					<Placeholder xs={Math.floor(Math.random() * 7) + 1} />
					<Placeholder xs={Math.floor(Math.random() * 7) + 1} />
					<Placeholder xs={Math.floor(Math.random() * 7) + 1} />
				</Placeholder>
			</Card.Body>
		</Card>
	);
};

export default CardPlaceHolder;
