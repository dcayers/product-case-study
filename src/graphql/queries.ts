import { gql } from "@apollo/client";

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
