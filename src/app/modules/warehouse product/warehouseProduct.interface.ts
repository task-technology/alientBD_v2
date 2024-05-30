export type IWarehouseProductFilterRequest = {
  searchTerm?: string | undefined;
  warehoueId?: number | undefined;
  productId?: number | undefined;
  quantity?: number | undefined;
};

export type WarehouseProductCreatedEvent = {
  warehouseId: number;
  product: {
    productId: number;
    quantity: number;
  }[];
};
