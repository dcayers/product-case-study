import { gql } from "@apollo/client";

export const ORDER_QUERY_FRAGMENT = gql`
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
