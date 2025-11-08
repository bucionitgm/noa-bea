# Shopify Hydrogen React Router Project

This is a Shopify Hydrogen storefront built with React Router 7.9.x (not Remix). The project runs on Shopify Oxygen edge workers and uses TypeScript, Vite, and Tailwind CSS.

## Critical Import Rules

**NEVER use `@remix-run/*` packages.** This project uses React Router v7, not Remix.

```tsx
// ✅ CORRECT - Use react-router
import { useLoaderData, Link, Form } from 'react-router';

// ❌ WRONG - Don't use remix or react-router-dom
import { useLoaderData } from '@remix-run/react';
import { useLoaderData } from 'react-router-dom';
```

See `.cursor/rules/hydrogen-react-router.mdc` for the complete import mapping table.

## Architecture Overview

### Request Flow (Oxygen Worker → React Router)
1. `server.ts` - Oxygen worker entry point, creates Hydrogen context via `createHydrogenRouterContext()`
2. `app/lib/context.ts` - Initializes Hydrogen with Shopify Storefront/Customer Account APIs, cart, session
3. `app/root.tsx` - Root layout with critical data (header) and deferred data (footer, cart, auth status)
4. Routes execute loaders/actions with full Hydrogen context (`storefront`, `cart`, `customerAccount`, `session`)

### Data Loading Pattern
All route loaders follow this split pattern from `app/routes/products.$handle.tsx`:

```typescript
export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);        // Non-critical, below-fold
  const criticalData = await loadCriticalData(args);  // Critical, above-fold (awaited)
  return {...deferredData, ...criticalData};
}
```

**Critical data**: Product details, navigation - blocks render if unavailable
**Deferred data**: Reviews, recommendations - page renders without them

### Hydrogen Context Access
Routes receive `context` with these key services:
- `context.storefront` - Shopify Storefront API client (use `.query()` with GraphQL)
- `context.cart` - Cart operations (`.addLines()`, `.updateLines()`, `.removeLines()`)
- `context.customerAccount` - Customer Account API for auth
- `context.session` - Cookie-based session (extends `HydrogenSession`)
- `context.env` - Environment variables (`PUBLIC_STOREFRONT_API_TOKEN`, `SESSION_SECRET`, etc.)

## GraphQL Patterns

### Location & Organization
- Shared fragments: `app/lib/fragments.ts` (CART_QUERY_FRAGMENT, HEADER_QUERY, FOOTER_QUERY)
- Route-specific queries: Inline at bottom of route files with fragments
- Customer Account queries: `app/graphql/customer-account/` (separate schema)

### Query Pattern
```typescript
const {product} = await context.storefront.query(PRODUCT_QUERY, {
  variables: { handle, selectedOptions: getSelectedProductOptions(request) },
  cache: storefront.CacheLong(),  // or CacheShort(), CacheNone()
});
```

### Two GraphQL Schemas
1. **Storefront API** (default) - Products, collections, cart
2. **Customer Account API** (customer project) - Auth, orders, addresses

Codegen configured in `.graphqlrc.ts` generates types to `storefrontapi.generated.d.ts` and `customer-accountapi.generated.d.ts`.

## Cart Operations

Cart actions use `CartForm` from `@shopify/hydrogen` (see `app/routes/cart.tsx`):

```typescript
export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;
  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);
  
  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    // ... other actions
  }
  
  // Set cart cookie
  const headers = cart.setCartId(result.cart.id);
  return data({ cart: result.cart }, { headers });
}
```

Frontend: Use `<AddToCartButton>` component (wraps CartForm) - opens cart aside on success.

## Product Variants & Options

Use Hydrogen's optimistic variant hooks from `@shopify/hydrogen`:
- `useOptimisticVariant()` - Client-side optimistic updates
- `getProductOptions()` - Formats options for UI
- `getAdjacentAndFirstAvailableVariants()` - Gets nearby variants
- `useSelectedOptionInUrlParam()` - Syncs variant to URL search params

Pattern in `app/routes/products.$handle.tsx` and `app/components/ProductForm.tsx`.

## Session Management

Custom session class (`app/lib/session.ts`) implements `HydrogenSession`:
- Uses React Router's `createCookieSessionStorage`
- Tracks `isPending` to conditionally commit in `server.ts`
- Requires `SESSION_SECRET` env var (throws if missing)

```typescript
if (hydrogenContext.session.isPending) {
  response.headers.set('Set-Cookie', await hydrogenContext.session.commit());
}
```

## Development Workflow

```bash
npm run dev          # Shopify CLI dev server with codegen
npm run build        # Production build + codegen
npm run codegen      # Generate GraphQL types + React Router types
npm run typecheck    # TypeScript check + React Router typegen
```

**GraphQL codegen runs automatically** with `--codegen` flag in dev/build scripts.

## Environment Variables

Required in `.env` (see `app/lib/context.ts`):
- `SESSION_SECRET` - Cookie encryption (throws if missing)
- `PUBLIC_STOREFRONT_API_TOKEN` - Shopify Storefront API token
- `PUBLIC_STORE_DOMAIN` - Store domain (e.g., `example.myshopify.com`)
- `PUBLIC_CHECKOUT_DOMAIN` - Checkout domain
- `PUBLIC_STOREFRONT_ID` - For analytics

## Route Conventions

- File-based routing via `@react-router/fs-routes` (see `app/routes.ts`)
- Route types generated: `import type {Route} from './+types/products.$handle'`
- Use `Route.LoaderArgs`, `Route.ActionArgs`, `Route.MetaFunction`

### Special Routes
- `_index.tsx` - Home page
- `$.tsx` - Catch-all 404
- `[robots.txt].tsx` / `[sitemap.xml].tsx` - Static routes
- `account.tsx` - Layout route with nested auth routes

## Performance Optimizations

1. **shouldRevalidate** in `root.tsx` - Prevents unnecessary root data refetches
2. **Deferred data pattern** - Split critical/non-critical data in loaders
3. **Cache strategies** - Use `storefront.CacheLong()` for stable data
4. **Asset optimization** - `assetsInlineLimit: 0` in `vite.config.ts` for CSP compliance
5. **Storefront redirects** - Handled in `server.ts` for localized handles

## Common Patterns

### Error Handling
Use `isRouteErrorResponse` from `react-router` in ErrorBoundary (see `root.tsx`).

### Redirects
```typescript
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
redirectIfHandleIsLocalized(request, {handle, data: product});
```

### Analytics
Wrap app in `<Analytics.Provider>` (root.tsx), use `<Analytics.ProductView>` in product pages.

### Aside/Drawer Pattern
`app/components/Aside.tsx` provides context for cart/mobile menu drawers. Use `useAside()` hook.

## Key Files Reference

- `server.ts` - Oxygen worker, request handling, 404 redirects
- `app/root.tsx` - Layout, Analytics, critical/deferred data split
- `app/lib/context.ts` - Hydrogen context setup, session init
- `app/lib/fragments.ts` - Shared GraphQL fragments
- `vite.config.ts` - Hydrogen, Oxygen, React Router, Tailwind plugins
- `react-router.config.ts` - React Router config with Hydrogen preset

## Folder-Specific Instructions

For detailed guidance on working with specific folders in the `app/` directory, refer to these instruction files:

- **app/assets/** - Static assets (fonts, icons, SVGs) bundled with the application
- **app/components/** - Reusable UI components shared across routes
- **app/graphql/** - Customer Account API GraphQL queries and mutations
- **app/lib/** - Shared utilities, Hydrogen context, session management, and GraphQL fragments
- **app/routes/** - File-based routing with loaders, actions, and page components
- **app/styles/** - CSS files including Tailwind configuration and custom styles

## Troubleshooting

- **GraphQL errors**: Run `npm run codegen` to regenerate types
- **Import errors**: Check you're using `react-router` not `@remix-run/react`
- **Session errors**: Verify `SESSION_SECRET` is set in `.env`
- **404s**: Check route file naming follows React Router conventions
