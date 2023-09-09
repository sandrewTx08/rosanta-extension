export default class CatalogItemsDetailsQueryParamDTO {
  constructor(
    public Category: number,
    public salesTypeFilter: number,
    public SortType: number,
    public IncludeNotForSale: boolean,
    public Limit: 10 | 30 | 60 | 120,
    public pxMin: number,
    public pxMax: number,
    public SortAggregation: number,
    public CurrencyType: number
  ) {}
}
