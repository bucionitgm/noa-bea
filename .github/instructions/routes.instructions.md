---
applyTo: "app/routes/**"
---

# Routes Folder Instructions

File-based routing using `@react-router/fs-routes`. Each file represents a route endpoint with loaders, actions, and components.

## Route File Naming Conventions

```
_index.tsx                    → /
products.$handle.tsx          → /products/:handle
account.orders.$id.tsx        → /account/orders/:id
account_.login.tsx            → /login (pathless parent)
[robots.txt].tsx              → /robots.txt (escape brackets)
$.tsx                         → /* (catch-all/splat)
```

## Route Module Structure

Every route file exports:

```typescript
import type {Route} from './+types/products.$handle';

export async function loader({context, params, request}: Route.LoaderArgs) {
  const {storefront, cart, customerAccount, session, env} = context;
  
  // Split critical (awaited) and deferred (promise) data
  const deferredData = loadDeferredData({context, params});
  const criticalData = await loadCriticalData({context, params, request});
  
  return {...deferredData, ...criticalData};
}

export async function action({context, request}: Route.ActionArgs) {
  // Handle POST/PUT/DELETE
}

export const meta: Route.MetaFunction = ({data}) => [{title: data.product.title}];

export default function ProductPage() {
  const data = useLoaderData<typeof loader>();
  return <div>{/* ... */}</div>;
}
```

## Critical vs Deferred Data Pattern

**Always split data loading** to optimize TTFB:

```typescript
// Critical: Blocks render, needed above-fold
async function loadCriticalData({context, params, request}) {
  const {storefront} = context;
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle: params.handle},
  });
  return {product};
}

// Deferred: Loads in parallel, below-fold
function loadDeferredData({context}) {
  return {
    recommendations: context.storefront.query(RECOMMENDATIONS_QUERY)
      .catch(err => {
        console.error(err);
        return null; // Don't throw in deferred
      }),
  };
}
```

**Rule**: Never throw errors in deferred loaders - page must still render.

## Context Object Reference

```typescript
context.storefront.query(QUERY, {variables, cache})
context.cart.get() / .addLines() / .updateLines() / .removeLines()
context.customerAccount.query() / .mutate() / .isLoggedIn()
context.session.get(key) / .set(key, value) / .commit()
context.env.PUBLIC_STOREFRONT_API_TOKEN / .SESSION_SECRET
```

## Common Patterns

- **Product pages**: Use `getSelectedProductOptions(request)`, `useOptimisticVariant()`, `redirectIfHandleIsLocalized()`
- **Cart actions**: Use `CartForm.getFormInput(formData)`, always set cart cookie via `cart.setCartId()`
- **Account routes**: Query `CUSTOMER_DETAILS_QUERY`, set `shouldRevalidate() { return true; }`
- **Collections**: Support pagination via `?cursor=` param

## GraphQL in Routes

- Shared fragments: `app/lib/fragments.ts`
- Route-specific: Bottom of route file
- **Always use `as const`** for GraphQL strings

## Performance

1. Cache strategically: `storefront.CacheLong()` for stable data
2. Parallel queries: `Promise.all([query1, query2])`
3. Defer non-critical data
4. Override `shouldRevalidate` to prevent refetches

## Common Gotchas

- ❌ Don't forget `as const` on GraphQL strings
- ❌ Don't throw in deferred loaders
- ❌ Don't forget cart cookie after mutations
- ❌ Don't use `@remix-run/react` imports (use `react-router`)
