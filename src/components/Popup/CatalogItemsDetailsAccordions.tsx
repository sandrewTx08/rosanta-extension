import {
	Accordion,
	Row,
	Col,
	Placeholder,
	Stack,
	InputGroup,
	Form,
	Pagination,
	OverlayTrigger,
} from "react-bootstrap";
import CatalogItemsLink from "../../roblox/roblox-catalog/CatalogItemsLink";
import BrowserStorage from "../../BrowserStorage";
import { useState, useEffect } from "preact/hooks";
import { Search } from "react-bootstrap-icons";

const CatalogItemsDetailsAccordions = <
	T extends BrowserStorage["autoBuyerCatalogItemsDetails"],
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

	const [page, setpage] = useState(0);
	const pageLimit = 100;

	const searchResultData = data.filter(({ name }) =>
		name.trim().toLowerCase().startsWith(search.trim().toLowerCase()),
	) as T;

	const totalOfPages = Math.ceil(searchResultData.length / pageLimit);

	useEffect(() => {
		setpage(0);
	}, [search, data[0]?.id]);

	return (
		active && (
			<>
				<div className="fs-3 text-dark">
					Items <span className="text-muted">({data.length})</span>
				</div>

				{search && (
					<div className="muted small">
						{searchResultData.length} result for term{" "}
						<span className="text-muted">"{search}"</span>
					</div>
				)}

				<Accordion flush className="border rounded">
					<Accordion.Item eventKey="0">
						<InputGroup className="bg-light border-0">
							<InputGroup.Text className="bg-transparent border-0 rounded-circle text-primary">
								<Search />
							</InputGroup.Text>
							<Form.Control
								className="bg-transparent border-0"
								disabled={data.length < 1}
								placeholder="Search item names"
								onChange={(event) => {
									setsearch(event.target.value);
								}}
							/>
						</InputGroup>
					</Accordion.Item>

					{searchResultData.length > 0
						? searchResultData
								.slice(page * pageLimit, (page + 1) * pageLimit)
								.map((data) => (
									<Accordion.Item
										key={data.id + data.productId}
										eventKey={data.id.toString()}
									>
										<Accordion.Header className="rows">
											<Col className="text-center" xs={1}>
												<OverlayTrigger
													placement="right-end"
													overlay={
														<img
															src={data.imageBatch?.imageUrl}
															className="z-2"
															height={400}
															alt=""
														/>
													}
												>
													<a
														href={CatalogItemsLink.parseCatalogDetails(data)}
														target="_blank"
													>
														<img
															height={40}
															className="w-100"
															src={data.imageBatch?.imageUrl || "icon.png"}
															alt=""
														/>
													</a>
												</OverlayTrigger>
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
														bg="primary"
														size="sm"
														xs={Math.floor(Math.random() * 4) + 1}
													/>
												))}{" "}
												{Array.from({ length: 1 }).map((_, i) => (
													<Placeholder
														key={i}
														bg="primary"
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
														bg="primary"
														size="sm"
														xs={Math.floor(Math.random() * 12) + 1}
													/>
												))}
											</Placeholder>
										</Stack>
									</Accordion.Body>
								</Accordion.Item>
						  ))}

					<Pagination
						style={{ bottom: 6 }}
						className="position-sticky z-3 rounded-pill d-flex justify-content-center p-2 m-0"
					>
						<Pagination.First
							disabled={page < 0}
							onClick={() => {
								setpage(0);
							}}
						/>
						<Pagination.Prev
							disabled={page - 1 < 0}
							onClick={() => {
								setpage((value) => --value);
							}}
						/>
						<Pagination.Item
							hidden={page - 2 < 0}
							onClick={() => {
								setpage((value) => (value -= 2));
							}}
						>
							{page - 2}
						</Pagination.Item>
						<Pagination.Item
							hidden={page - 1 < 0}
							onClick={() => {
								setpage((value) => --value);
							}}
						>
							{page - 1}
						</Pagination.Item>
						<Pagination.Item active>{page}</Pagination.Item>
						<Pagination.Item
							hidden={page + 1 > totalOfPages}
							onClick={() => {
								setpage((value) => ++value);
							}}
						>
							{page + 1}
						</Pagination.Item>
						<Pagination.Item
							hidden={page + 2 > totalOfPages}
							onClick={() => {
								setpage((value) => (value += 2));
							}}
						>
							{page + 2}
						</Pagination.Item>
						<Pagination.Next
							disabled={page >= totalOfPages}
							onClick={() => {
								setpage((value) => ++value);
							}}
						/>
						<Pagination.Last
							disabled={page >= totalOfPages}
							onClick={() => setpage(totalOfPages)}
						/>
					</Pagination>
				</Accordion>
			</>
		)
	);
};

export default CatalogItemsDetailsAccordions;
