import { getClient } from "./client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
} from "./queries";
import type {
  Cart,
  CartLineInput,
  CartLineUpdateInput,
  ShopifyUserError,
} from "./types";

/**
 * Cart mutation helpers — thin wrappers over Storefront API calls that
 * return a narrowed `Cart` or surface `userErrors`.
 *
 * All functions resolve to `null` (silently) when Shopify isn't configured
 * yet — the UI handles that case by showing a "store launching soon"
 * message instead of crashing.
 *
 * Note: the GraphQL CartLineInput input object natively accepts
 * `sellingPlanId`, so subscription lines need no mutation changes — the
 * field passes straight through in `variables.lines`.
 */

async function callMutation<TVars extends Record<string, unknown>>(
  query: string,
  variables: TVars,
  rootField: string,
): Promise<Cart | null> {
  const client = getClient();
  if (!client) return null;
  const { data, errors } = await client.request(query, { variables });
  if (errors) {
    throw new Error(errors.message ?? "Shopify request failed");
  }
  const result = data?.[rootField] as
    | { cart: Cart | null; userErrors: ShopifyUserError[] }
    | undefined;
  if (result?.userErrors?.length) {
    throw new Error(result.userErrors.map((e) => e.message).join("; "));
  }
  return result?.cart ?? null;
}

export async function cartCreate(lines: CartLineInput[]): Promise<Cart | null> {
  return callMutation(CART_CREATE_MUTATION, { lines }, "cartCreate");
}

export async function cartLinesAdd(
  cartId: string,
  lines: CartLineInput[],
): Promise<Cart | null> {
  return callMutation(
    CART_LINES_ADD_MUTATION,
    { cartId, lines },
    "cartLinesAdd",
  );
}

export async function cartLinesUpdate(
  cartId: string,
  lines: CartLineUpdateInput[],
): Promise<Cart | null> {
  return callMutation(
    CART_LINES_UPDATE_MUTATION,
    { cartId, lines },
    "cartLinesUpdate",
  );
}

export async function cartLinesRemove(
  cartId: string,
  lineIds: string[],
): Promise<Cart | null> {
  return callMutation(
    CART_LINES_REMOVE_MUTATION,
    { cartId, lineIds },
    "cartLinesRemove",
  );
}

/** Fetch an existing cart by id. Returns null if the cart was deleted or
 *  if Shopify isn't configured. */
export async function cartGet(cartId: string): Promise<Cart | null> {
  const client = getClient();
  if (!client) return null;
  const { data, errors } = await client.request(CART_QUERY, {
    variables: { cartId },
  });
  if (errors) {
    throw new Error(errors.message ?? "Shopify request failed");
  }
  return (data?.cart as Cart | null) ?? null;
}
