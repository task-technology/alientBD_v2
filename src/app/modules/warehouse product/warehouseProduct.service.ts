import { Prisma, WarehouseProduct } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IEmployeeFilterRequest } from '../Employee/employee.interface';
import { WarehouseProductCreatedEvent } from './warehouseProduct.interface';

const insertIntoDB = async (
  data: WarehouseProductCreatedEvent[],
): Promise<WarehouseProduct[]> => {
  const warehouseProducts = await prisma.$transaction(async prisma => {
    const results = [];

    for (const item of data) {
      let warehouseProduct = await prisma.warehouseProduct.findFirst({
        where: {
          warehouseId: item.warehouseId,
          productId: item.productId,
        },
      });

      if (warehouseProduct) {
        warehouseProduct = await prisma.warehouseProduct.update({
          where: { id: warehouseProduct.id },
          data: { quantity: warehouseProduct.quantity + item.quantity },
        });
      } else {
        warehouseProduct = await prisma.warehouseProduct.create({
          data: {
            warehouseId: item.warehouseId,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }

      await prisma.product.update({
        where: { id: item.productId },
        data: {
          availableQty: {
            increment: item.quantity,
          },
          totalPurchased: {
            increment: item.quantity,
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
  filters: IEmployeeFilterRequest,
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
  warehouseId: number,
  productId: number,
  quantity: number,
): Promise<WarehouseProduct | null> => {
  const result = await prisma.warehouseProduct.findFirst({
    where: {
      warehouseId,
      productId,
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
};

export const warehouseProductService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  getBywarehouseProductCountFromDB,
  CheckQtyFromDB,
};
