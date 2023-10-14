import { gql } from "@apollo/client";

const ORDER_QUERY_FRAGMENT = gql`
  fragment CoreOrderFields on Order {
    id
    orderNo
    status
    description
    updatedAt
    createdAt
    products {
      product {
        createdAt
        description
        id
        name
        price
        quantity
        updatedAt
      }
      quantity
    }
  }
`;

export const ORDERS_QUERY = gql`
  query OrdersQuery {
    orders {
      id
      orderNo
      status
      description
      updatedAt
      createdAt
      products {
        product {
          createdAt
          description
          id
          name
          price
          quantity
          updatedAt
        }
        quantity
      }
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
  query GetOrderByOrderNo($orderNo: String!) {
    getOrderByOrderNumber(orderNo: $orderNo) {
      id
      orderNo
      description
      products {
        quantity
        product {
          id
          name
          quantity
        }
      }
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
