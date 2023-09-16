import CatalogItemsDetailsQueryResponse from './CatalogItemsDetailsQueryResponse';

export default class CatalogItemsLink {
  static parse(
    itemType: CatalogItemsDetailsQueryResponse['data'][0]['itemType'],
    id: number
  ): string {
    switch (itemType) {
      case 'Bundle':
        return `https://www.roblox.com/bundles/${id}`;
      case 'Asset':
        return `https://www.roblox.com/catalog/${id}`;
      default:
        throw new Error('Invalid item type');
    }
  }

  static parseCatalogDetails(catalogDetails: CatalogItemsDetailsQueryResponse['data'][0]): string {
    return CatalogItemsLink.parse(
      catalogDetails.itemType,
      catalogDetails.itemType == 'Bundle' ? catalogDetails.id : catalogDetails.productId
    );
  }
}
