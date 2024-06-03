import { Prisma, WarehouseProduct } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  IWarehouseProductFilterRequest,
  WarehouseProductCreatedEvent,
} from './warehouseProduct.interface';

const insertIntoDB = async (
  data: WarehouseProductCreatedEvent[],
): Promise<WarehouseProduct[]> => {
  const warehouseProducts = await prisma.$transaction(async prisma => {
    const results = [];

    for (const item of data) {
      let warehouseProduct = await prisma.warehouseProduct.findFirst({
        where: {
          warehouseId: parseInt(item.warehouseId),
          productId: parseInt(item.productId),
        },
      });

      if (warehouseProduct) {
        warehouseProduct = await prisma.warehouseProduct.update({
          where: { id: warehouseProduct.id },
          data: {
            quantity: warehouseProduct.quantity + parseInt(item.quantity),
          },
        });
      } else {
        warehouseProduct = await prisma.warehouseProduct.create({
          data: {
            warehouseId: parseInt(item.warehouseId),
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
          },
        });
      }

      await prisma.product.update({
        where: { id: parseInt(item.productId) },
        data: {
          availableQty: {
            increment: parseInt(item.quantity),
          },
          totalPurchased: {
            increment: parseInt(item.quantity),
          },
        },
      });

      results.push(warehouseProduct);
    }

    return results;
  });

  return warehouseProducts;
};

const getAllFromDB = async (
  filters: IWarehouseProductFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<WarehouseProduct[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.WarehouseProductWhereInput[] = [];

  andConditions.push({
    quantity: {
      gt: 0,
    },
  });

  if (searchTerm) {
    andConditions.push({
      OR: [
        { product: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { product: { brand: { contains: searchTerm, mode: 'insensitive' } } },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions: Prisma.WarehouseProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  console.log('search', searchTerm);
  const result = await prisma.warehouseProduct.findMany({
    where: whereConditions,
    include: {
      product: {
        select: {
          name: true,
          brand: true,
        },
      },
      warehouse: {
        select: {
          name: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.warehouseProduct.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: number): Promise<WarehouseProduct | null> => {
  const result = await prisma.warehouseProduct.findUnique({
    where: {
      id,
    },
    include: {
      product: {
        select: {
          name: true,
          brand: true,
        },
      },
      warehouse: {
        select: {
          name: true,
        },
      },
    },
  });
  return result;
};

const CheckQtyFromDB = async (
  warehouseId: string,
  productId: string,
  quantity: number,
): Promise<WarehouseProduct | null> => {
  const result = await prisma.warehouseProduct.findFirst({
    where: {
      warehouseId: parseInt(warehouseId),
      productId: parseInt(productId),
      quantity: {
        gte: quantity,
      },
    },
  });

  return result;
};

const getBywarehouseProductCountFromDB = async () => {
  const warehouses = await prisma.warehouse.findMany({
    include: {
      products: {
        select: {
          quantity: true,
        },
      },
    },
  });
  const summary = warehouses.map(warehouse => {
    const productCount = warehouse.products.length;
    const totalQuantity = warehouse.products.reduce(
      (sum, product) => sum + product.quantity,
      0,
    );

    return {
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      productCount,
      totalQuantity,
    };
  });
  return summary;
};

export const warehouseProductService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  getBywarehouseProductCountFromDB,
  CheckQtyFromDB,
};
