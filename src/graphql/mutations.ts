import { gql } from "@apollo/client";

/**
 * Creates a new draft order for the user to update details against
 */
export const CREATE_DRAFT_ORDER = gql`
  mutation CreateDraftOrder {
    createDraftOrder {
      id
      orderNo
      status
      updatedAt
      createdAt
    }
  }
`;

export const UPDATE_DRAFT_ORDER = gql`
  mutation UpdateDraftOrder($input: UpdateOrderInput!) {
    updateDraftOrder(input: $input) {
      orderNo
      description
      id
      updatedAt
      shipping {
        contactEmail
        contactName
        contactNumber
        deliveryAddress
      }
    }
  }
`;
