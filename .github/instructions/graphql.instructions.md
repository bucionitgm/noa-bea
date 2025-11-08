---
applyTo: "app/graphql/**"
---

# GraphQL Folder Instructions

GraphQL queries for the Customer Account API (separate from Storefront API).

## Two Shopify GraphQL Schemas

1. **Storefront API** (default) - Products, collections, cart
   - Used in: Routes, components, `app/lib/fragments.ts`
   - Queries via: `context.storefront.query()`
   - Types: `storefrontapi.generated.d.ts`

2. **Customer Account API** (customer project) - Auth, orders, addresses
   - Used in: `app/graphql/customer-account/`, account routes
   - Queries via: `context.customerAccount.query()`
   - Types: `customer-accountapi.generated.d.ts`

## Files in customer-account/

- `CustomerDetailsQuery.ts` - Customer profile
- `CustomerOrdersQuery.ts` - Paginated orders
- `CustomerOrderQuery.ts` - Single order details
- `CustomerUpdateMutation.ts` - Update profile
- `CustomerAddressMutations.ts` - CRUD for addresses

## Usage Pattern

### In Route Loaders
```typescript
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  
  // Note: customerAccount.query(), not storefront.query()
  const {data, errors} = await customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
    {variables: {language: customerAccount.i18n.language}}
  );
  
  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }
  
  return {customer: data.customer};
}
```

### In Route Actions (Mutations)
```typescript
const {data, errors} = await customerAccount.mutate(
  CUSTOMER_UPDATE_MUTATION,
  {variables: {input: {firstName, lastName}}}
);

// Always check userErrors
if (data?.customerUpdate?.userErrors?.length) {
  return {errors: data.customerUpdate.userErrors};
}
```

## GraphQL Codegen

Configured in `.graphqlrc.ts`:

```typescript
export default {
  projects: {
    default: {
      schema: getSchema('storefront'),
      documents: [
        './app/**/*.{ts,tsx}',
        '!./app/graphql/**/*.{ts,tsx}',  // Exclude!
      ],
    },
    customer: {
      schema: getSchema('customer-account'),
      documents: ['./app/graphql/customer-account/*.{ts,tsx}'],
    },
  },
};
```

Run `npm run codegen` to regenerate types.

## Authentication

All Customer Account queries require authenticated session:

```typescript
export async function loader({context}: Route.LoaderArgs) {
  if (!await context.customerAccount.isLoggedIn()) {
    return redirect('/account/login');
  }
  // Proceed with query
}
```

## Error Handling

```typescript
// Network/GraphQL errors
if (errors?.length) {
  throw new Error('Failed to fetch customer data');
}

// Mutation userErrors
if (data?.customerUpdate?.userErrors?.length) {
  return {errors: data.customerUpdate.userErrors};
}
```

## Caching

Customer Account API responses **should not be cached**:

```typescript
return data(
  {customer: data.customer},
  {headers: {'Cache-Control': 'no-cache, no-store, must-revalidate'}}
);
```

## Best Practices

- ✅ Export queries `as const` for type inference
- ✅ Check `errors` array from queries
- ✅ Validate `userErrors` from mutations
- ✅ Use `@inContext` for language/country
- ✅ Set `no-cache` headers for customer data
- ❌ Don't use Storefront API queries here
- ❌ Don't cache responses
- ❌ Don't forget authentication check
