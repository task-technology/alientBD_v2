export type IWarehouseProductFilterRequest = {
  searchTerm?: string | undefined;
  warehoueId?: number | undefined;
  productId?: number | undefined;
  quantity?: number | undefined;
};

export type WarehouseProductCreatedEvent = {
  warehouseId: number;
  productId: number;
  quantity: number;
};
