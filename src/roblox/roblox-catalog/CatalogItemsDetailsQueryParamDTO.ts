export default class CatalogItemsDetailsQueryParamDTO {
	constructor(
		public category: number,
		public salesTypeFilter: number,
		public sortType: number,
		public includeNotForSale: boolean,
		public limit: 10 | 30 | 60 | 120,
		public minPrice: number,
		public maxPrice: number,
		public sortAggregation: number,
		public currencyType: number,
		public creatorName: string,
	) {}
}
