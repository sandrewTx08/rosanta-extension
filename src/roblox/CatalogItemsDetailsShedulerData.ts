import CatalogItemsDetailsQueryResponse from './CatalogItemsDetailsQueryResponse';

export default class CatalogItemsDetailsShedulerData {
  constructor(
    public data: CatalogItemsDetailsQueryResponse['data'][0],
    public alertISODate: string
  ) {}
}
