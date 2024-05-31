export type IWarehouseProductFilterRequest = {
  searchTerm?: string | undefined;
  warehoueId?: number | undefined;
  productId?: number | undefined;
  quantity?: number | undefined;
};

export type WarehouseProductCreatedEvent = {
  warehouseId: string;
  productId: string;
  quantity: string;
};
