export default class ProductPurchaseDTO {
  constructor(
    public expectedCurrency: number,
    public expectedPrice: number,
    public expectedSellerId: number
  ) {}
}
