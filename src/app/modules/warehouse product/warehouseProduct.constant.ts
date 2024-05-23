export const productFilterableFields: string[] = [
  'searchTerm',
  'name',
  'brand',
  'unit',
  'availableQty',
  'totalPurchased',
  'remainderQty',
  'sell',
];

export const productSearchableFields: string[] = [
  'product.name',
  'product.brand',
];

export const productRelationalFields: string[] = ['productId', 'warehouseId'];
export const productRelationalFieldsMapper: { [key: string]: string } = {
  productId: 'product',
  warehouseId: 'warehouse',
};
