export type IProductFilterRequest = {
  searchTerm?: string | undefined;
};

export type IOrderCreatedEvent = {
  warehouseId: number;
  customerId: number;
  inchargeId: number;
  createdById: number;
  products: {
    productId: number;
    quantity: number;
  }[];
};
