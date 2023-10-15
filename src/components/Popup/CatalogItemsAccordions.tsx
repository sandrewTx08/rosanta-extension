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
import { Search } from "react-bootstrap-icons";

const CatalogItemsAccordions = <
	T extends BrowserStorage["catalogItemsAutoBuyerAssets"],
>({
	data,
	active = false,
	body,
	headerRight,
}: React.PropsWithChildren<{
	data: T;
	active?: boolean;
	body?(data: T[0]): React.ReactNode;
	headerRight?(data: T[0]): React.ReactNode;
}>) => {
	const [search, setsearch] = useState("");

	return (
		active && (
			<>
				<h3 className="text-dark">Items</h3>
				<Stack gap={2}>
					<Accordion>
						<Accordion.Item eventKey="0">
							<InputGroup className="rounded p-3">
								<InputGroup.Text>
									<Search />
								</InputGroup.Text>
								<Form.Control
									disabled={data.length <= 0}
									placeholder="Search item names"
									onChange={(event) => {
										setsearch(event.target.value);
									}}
								/>
							</InputGroup>
						</Accordion.Item>

						{data.length > 0
							? data
									.filter(({ name }) =>
										name.trim().toLowerCase().includes(search.trim().toLowerCase()),
									)
									.map((data) => (
										<Accordion.Item
											key={data.id + data.productId}
											eventKey={data.id.toString()}
										>
											<Accordion.Header className="rows">
												<Col className="text-center" xs={1}>
													<a
														href={CatalogItemsLink.parseCatalogDetails(data)}
														target="_blank"
													>
														<img
															height={40}
															className="w-auto"
															src={data.imageBatch?.imageUrl || "icon.png"}
															alt=""
														/>
													</a>
												</Col>

												<Col className="text-break mx-4">{data.name}</Col>

												{headerRight && (
													<Col xs={3} className="d-flex align-items-center gap-2 mx-2">
														{headerRight(data)}
													</Col>
												)}
											</Accordion.Header>
											<Accordion.Body className="d-flex gap-2">
												<Row className="m-0">
													<Col className="text-center" xs={12}>
														<a
															href={CatalogItemsLink.parseCatalogDetails(data)}
															target="_blank"
														>
															<img
																title={data.name}
																height={350}
																className="w-auto"
																src={data.imageBatch?.imageUrl || "icon.png"}
																alt=""
															/>
														</a>
													</Col>

													<Col xs={12}>
														<Row className="gy-2 pb-3">
															<Col className="border-bottom" xs={12}>
																<h2 className="text-dark">{data.name}</h2>
															</Col>

															<Col xs={3}>By</Col>
															<Col xs={9}>
																<a
																	className="link-dark"
																	href={`http://www.roblox.com/${
																		data.creatorType.toLocaleLowerCase() + "s"
																	}/${data.creatorTargetId}`}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	{data.creatorName}
																</a>
															</Col>

															<Col xs={3}>Type</Col>
															<Col xs={9}>{data.itemType}</Col>

															<Col xs={3}>Description</Col>
															<Col className="text-break" xs={9}>
																{data.description}
															</Col>

															{body && body(data)}
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
				</Stack>
			</>
		)
	);
};

export default CatalogItemsAccordions;
