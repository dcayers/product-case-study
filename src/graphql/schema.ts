import { builder } from "./builder";
import "./types/Order";
import "./types/Product";
import "./types/Shipping";
import "./types/ProductOrders";

export const schema = builder.toSchema();
