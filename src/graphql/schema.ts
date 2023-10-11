import "./types/Order"
import "./types/Product"
import "./types/Shipping"
import "./types/ProductOrders"

import { builder } from "./builder"

export const schema = builder.toSchema()