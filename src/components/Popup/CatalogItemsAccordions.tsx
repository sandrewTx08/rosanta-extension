import {
	Accordion,
	Row,
	Col,
	Placeholder,
	Stack,
	InputGroup,
	Form,
} from "react-bootstrap";
import CatalogItemsLink from "../../roblox/roblox-catalog/CatalogItemsLink";
import BrowserStorage from "../../BrowserStorage";
import { useState } from "preact/hooks";

const CatalogItemsAccordions = <
	T extends BrowserStorage["catalogItemsAutoBuyerAssets"],
>({
	data,
	active = false,
	onMap,
}: React.PropsWithChildren<{
	data: T;
	active?: boolean;
	onMap?(data: T[0]): React.ReactNode;
}>) => {
	const [search, setsearch] = useState("");

	return (
		active && (
			<Accordion flush>
				<InputGroup size="sm">
					<Form.Control
						className="rounded mx-1 mb-2"
						disabled={data.length <= 0}
						placeholder="Search item names"
						onChange={(event) => {
							setsearch(event.target.value);
						}}
					/>
				</InputGroup>

				{data.length > 0
					? data
							.filter(({ name }) =>
								name.trim().toLowerCase().includes(search.trim().toLowerCase()),
							)
							.map((data) => (
								<Accordion.Item
									className="p-1"
									key={data.id + data.productId}
									eventKey={data.id.toString()}
								>
									<Accordion.Header className="text-truncate">
										<div className="d-flex gap-4 align-items-center">
											<a href={CatalogItemsLink.parseCatalogDetails(data)} target="_blank">
												<img
													height={40}
													className="w-auto"
													src={data.imageBatch?.imageUrl || "icon.png"}
													alt=""
												/>
											</a>
											{data.name}
										</div>
									</Accordion.Header>
									<Accordion.Body className="d-flex gap-2 px-0">
										<Row>
											<Col className="text-center" xs={12}>
												<a
													href={CatalogItemsLink.parseCatalogDetails(data)}
													target="_blank"
												>
													<img
														height={350}
														className="w-auto"
														src={data.imageBatch?.imageUrl || "icon.png"}
														alt=""
													/>
												</a>
											</Col>

											<Col xs={12}>
												<Row className="gy-2">
													<Col xs={12}>
														<h2>{data.name}</h2>
													</Col>

													<hr />

													<Col xs={3}>By</Col>
													<Col xs={9}>{data.creatorName}</Col>

													<Col xs={3}>Type</Col>
													<Col xs={9}>{data.itemType}</Col>

													<Col xs={3}>Description</Col>
													<Col className="text-break" xs={9}>
														{data.description}
													</Col>

													{onMap && onMap(data)}
												</Row>
											</Col>
										</Row>
									</Accordion.Body>
								</Accordion.Item>
							))
					: Array.from({ length: 4 }).map((_, i) => (
							<Accordion.Item key={i} eventKey={i.toString()}>
								<Accordion.Header>
									<Stack className="p-2" gap={2}>
										<Placeholder animation="glow">
											{Array.from({ length: 1 }).map((_, i) => (
												<Placeholder
													key={i}
													size="sm"
													xs={Math.floor(Math.random() * 4) + 1}
												/>
											))}{" "}
											{Array.from({ length: 1 }).map((_, i) => (
												<Placeholder
													key={i}
													size="sm"
													xs={Math.floor(Math.random() * 4) + 1}
												/>
											))}
										</Placeholder>
									</Stack>
								</Accordion.Header>
								<Accordion.Body>
									<Stack className="p-2" gap={2}>
										<Placeholder animation="glow">
											{Array.from({ length: 4 }).map((_, i) => (
												<Placeholder
													key={i}
													size="sm"
													xs={Math.floor(Math.random() * 12) + 1}
												/>
											))}
										</Placeholder>
									</Stack>
								</Accordion.Body>
							</Accordion.Item>
					  ))}
			</Accordion>
		)
	);
};

export default CatalogItemsAccordions;
