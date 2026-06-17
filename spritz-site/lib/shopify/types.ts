/**
 * Shopify Storefront API types — narrowed to what SPRITZ actually uses.
 * Full types live in @shopify/storefront-api-client/dist/types but they
 * pull in the whole admin schema; these are the trimmed shapes we touch.
 */

export interface Money {
  amount: string;
  currencyCode: string;
}

/** A discount applied by an automatic discount, code, or Function. */
export interface DiscountAllocation {
  discountedAmount: Money;
}

export interface CartLine {
  id: string; // line id within the cart
  quantity: number;
  merchandise: {
    id: string; // variant GID
    title: string; // variant title (e.g. "50ml")
    product: {
      id: string;
      title: string;
      handle: string;
      images: { nodes: Array<{ url: string; altText: string | null }> };
    };
    price: Money;
  };
  cost: {
    subtotalAmount: Money; // pre-discount line price
    totalAmount: Money; // what the line actually costs
  };
  discountAllocations: DiscountAllocation[];
  /** Present when the line was added with a selling plan (subscription). */
  sellingPlanAllocation: {
    sellingPlan: { id: string; name: string };
    priceAdjustments: Array<{ price: Money }>;
  } | null;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  discountCodes: Array<{ code: string; applicable: boolean }>;
  discountAllocations: DiscountAllocation[];
  lines: { nodes: CartLine[] };
}

/** Input for cartCreate / cartLinesAdd. sellingPlanId opts a line into a
 *  subscription plan; omit it for a one-time purchase. */
export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  sellingPlanId?: string;
}

export interface CartLineUpdateInput {
  id: string;
  quantity?: number;
  merchandiseId?: string;
  sellingPlanId?: string;
}

/** A subscription plan as exposed on a variant. */
export interface SellingPlan {
  id: string;
  name: string;
  recurringDeliveries: boolean;
  priceAdjustments: Array<{
    adjustmentValue:
      | { adjustmentPercentage: number }
      | { adjustmentAmount: Money }
      | { price: Money };
  }>;
}

export interface SellingPlanAllocation {
  sellingPlan: SellingPlan;
  /** The actual per-delivery price for this variant under the plan. */
  priceAdjustments: Array<{ price: Money }>;
}

/** Shopify mutation responses always have a `userErrors` field we surface. */
export interface ShopifyUserError {
  code?: string;
  field?: string[];
  message: string;
}
