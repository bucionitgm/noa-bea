---
applyTo: "app/components/**"
---

# Components Folder Instructions

Reusable UI components for the storefront shared across multiple routes.

## Component Categories

- **Cart**: `AddToCartButton`, `CartMain`, `CartLineItem`, `CartSummary`
- **Product**: `ProductForm`, `ProductImage`, `ProductPrice`, `ProductItem`
- **Layout**: `PageLayout`, `Header`, `Footer`, `Aside`
- **Search**: `SearchForm`, `SearchFormPredictive`, `SearchResults`, `SearchResultsPredictive`
- **Utility**: `PaginatedResourceSection`

## Hydrogen Components (Client)

Components using Hydrogen hooks **must** be client components:

```tsx
'use client'; // Only when using Hydrogen hooks

import {useOptimisticVariant, CartForm} from '@shopify/hydrogen';

export function ProductForm({product}) {
  const selectedVariant = useOptimisticVariant(/*...*/);
  // ...
}
```

**Hooks requiring client boundary**: `useOptimisticVariant()`, `useOptimisticCart()`, `useSelectedOptionInUrlParam()`, `CartForm`

## Aside (Drawer) Pattern

```tsx
// Setup in PageLayout
<Aside.Provider>
  <Aside type="cart" heading="Cart">
    <CartMain />
  </Aside>
  {children}
</Aside.Provider>

// Usage in components
import {useAside} from '~/components/Aside';

const {open} = useAside();
<button onClick={() => open('cart')}>Add to Cart</button>
```

Types: `'cart' | 'mobile' | 'search' | 'closed'`

## CartForm Integration

```tsx
import {CartForm} from '@shopify/hydrogen';

<CartForm
  route="/cart"
  action={CartForm.ACTIONS.LinesAdd}
  inputs={{lines: [{merchandiseId: variant.id, quantity: 1}]}}
>
  <button>Add to Cart</button>
</CartForm>
```

Actions: `LinesAdd`, `LinesUpdate`, `LinesRemove`, `DiscountCodesUpdate`, `BuyerIdentityUpdate`

## Product Variant Selection

```tsx
import {
  getProductOptions,
  useOptimisticVariant,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';

// 1. Optimistic updates
const selectedVariant = useOptimisticVariant(
  propVariant,
  getAdjacentAndFirstAvailableVariants(product)
);

// 2. Sync to URL
useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

// 3. Format for UI
const productOptions = getProductOptions({...product, selectedOrFirstAvailableVariant: selectedVariant});
```

**SEO-friendly**: Links for different products, buttons for same product variants

## Image Optimization

```tsx
import {Image} from '@shopify/hydrogen';

<Image
  data={product.image}
  sizes="(min-width: 45em) 50vw, 100vw"
  loading={aboveTheFold ? 'eager' : 'lazy'}
/>
```

## Best Practices

- ✅ Only add `'use client'` when using hooks/browser APIs
- ✅ Use Hydrogen's `Image` for Shopify images
- ✅ Handle null/undefined data gracefully
- ✅ Use generated types from `storefrontapi.generated.d.ts`
- ❌ Don't duplicate CartForm logic (use AddToCartButton)
- ❌ Don't render images without `sizes` attribute
