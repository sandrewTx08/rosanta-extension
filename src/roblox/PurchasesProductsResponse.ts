export default interface PurchasesProductsResponse {
  purchased: boolean;
  reason: string;
  productId: number;
  statusCode: number;
  title: string;
  errorMsg: string;
  showDivId: string;
  shortfallPrice: number;
  balanceAfterSale: number;
  expectedPrice: number;
  currency: number;
  price: number;
}
