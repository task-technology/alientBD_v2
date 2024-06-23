"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employee_routes_1 = require("../modules/Employee/employee.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const customer_routes_1 = require("../modules/customer/customer.routes");
const order_routes_1 = require("../modules/order/order.routes");
const product_routes_1 = require("../modules/products/product.routes");
const user_routes_1 = require("../modules/user/user.routes");
const warehouseLogs_routes_1 = require("../modules/warehouse logs/warehouseLogs.routes");
const warehouseProduct_routes_1 = require("../modules/warehouse product/warehouseProduct.routes");
const warehouse_routes_1 = require("../modules/warehouse/warehouse.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/',
        routes: auth_route_1.AuthRoutes,
    },
    {
        path: '/auth/user',
        routes: user_routes_1.UserRoutes,
    },
    {
        path: '/user',
        routes: employee_routes_1.employeeRoutes,
    },
    {
        path: '/customer',
        routes: customer_routes_1.customerRoutes,
    },
    {
        path: '/products',
        routes: product_routes_1.productRoutes,
    },
    {
        path: '/order',
        routes: order_routes_1.orderRoutes,
    },
    {
        path: '/warehouse',
        routes: warehouse_routes_1.warehouseRoutes,
    },
    {
        path: '/warehouse-products',
        routes: warehouseProduct_routes_1.warehouseProductRoutes,
    },
    {
        path: '/warehouse-logs',
        routes: warehouseLogs_routes_1.warehouseLogsRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.routes));
exports.default = router;
