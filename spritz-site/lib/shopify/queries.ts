/**
 * GraphQL fragments + queries + mutations for the Storefront API.
 *
 * Versioning: pinned to Storefront API `2024-10` in client.ts. Each major
 * Shopify release (~quarterly) may change non-deprecated fields — bump
 * the api version there when you upgrade.
 */

export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    discountCodes {
      code
      applicable
    }
    discountAllocations {
      discountedAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            product {
              id
              title
              handle
              images(first: 1) {
                nodes {
                  url
                  altText
                }
              }
            }
          }
        }
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        discountAllocations {
          discountedAmount {
            amount
            currencyCode
          }
        }
        sellingPlanAllocation {
          sellingPlan {
            id
            name
          }
          priceAdjustments {
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_QUERY = /* GraphQL */ `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

/**
 * Selling plans (subscriptions) available for a variant. Returns zero
 * allocations on a store without a subscription app installed — the UI
 * treats that as "one-time purchase only".
 */
export const VARIANT_SELLING_PLANS_QUERY = /* GraphQL */ `
  query VariantSellingPlans($id: ID!) {
    node(id: $id) {
      ... on ProductVariant {
        id
        sellingPlanAllocations(first: 10) {
          nodes {
            sellingPlan {
              id
              name
              recurringDeliveries
              priceAdjustments {
                adjustmentValue {
                  ... on SellingPlanPercentagePriceAdjustment {
                    adjustmentPercentage
                  }
                  ... on SellingPlanFixedAmountPriceAdjustment {
                    adjustmentAmount {
                      amount
                      currencyCode
                    }
                  }
                  ... on SellingPlanFixedPriceAdjustment {
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
            priceAdjustments {
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
