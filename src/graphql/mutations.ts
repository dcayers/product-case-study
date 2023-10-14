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

export const ADD_PRODUCT_ORDER_MUTATION = gql`
  mutation AddProductToOrder(
    $id: String!
    $productId: String!
    $quantity: Int!
  ) {
    addProductToOrder(id: $id, productId: $productId, quantity: $quantity) {
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

export const REMOVE_PRODUCT_ORDER_MUTATION = gql`
  mutation RemoveProductFromOrder(
    $id: String!
    $productId: String!
    $quantity: Int!
  ) {
    removeProductFromOrder(
      id: $id
      productId: $productId
      quantity: $quantity
    ) {
      id
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT_DETAILS_INLINE_MUTATION = gql`
  mutation UpdateProductDetailsInline(
    $id: String!
    $field: String!
    $value: String!
  ) {
    updateProductDetailsInline(id: $id, field: $field, value: $value) {
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

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      description
      createdAt
      name
      price
      quantity
      updatedAt
    }
  }
`;
