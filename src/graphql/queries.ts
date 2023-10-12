import { gql } from "@apollo/client";

export const ORDERS_QUERY = gql`
  query OrdersQuery {
    orders {
      id
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