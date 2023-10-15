import { gql } from "@apollo/client";
import { ORDER_QUERY_FRAGMENT } from "./fragments";

export const ORDERS_QUERY = gql`
  ${ORDER_QUERY_FRAGMENT}
  query OrdersQuery {
    orders {
      ...CoreOrderFields
    }
  }
`;

export const SEARCH_ORDERS_QUERY = gql`
  ${ORDER_QUERY_FRAGMENT}
  query SearchOrders($input: SearchOrderInput) {
    orders(input: $input) {
      ...CoreOrderFields
    }
  }
`;

export const ORDERS_BY_ORDER_NO_QUERY = gql`
  ${ORDER_QUERY_FRAGMENT}
  query GetOrderByOrderNo($orderNo: String!) {
    getOrderByOrderNumber(orderNo: $orderNo) {
      ...CoreOrderFields
      shipping {
        contactEmail
        contactName
        contactNumber
        deliveryAddress
      }
    }
  }
`;

export const SEARCH_PRODUCTS_QUERY = gql`
  query SearchProducts($search: String, $skip: Int, $take: Int) {
    getProducts(search: $search, skip: $skip, take: $take) {
      id
      name
      description
      price
      quantity
      createdAt
      updatedAt
    }
  }
`;
