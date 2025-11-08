---
applyTo: "app/lib/**"
---

# Lib Folder Instructions

Shared utilities, helpers, and configuration for the Hydrogen storefront.

## Core Files

- `context.ts` - Hydrogen context creation (cart, session, storefront, customer account)
- `fragments.ts` - Shared GraphQL fragments (cart, header, footer, menus)
- `session.ts` - Custom session implementation extending HydrogenSession
- `i18n.ts` - Internationalization locale detection
- `redirect.ts` - SEO redirect utilities for localized handles
- `search.ts` - Search utilities and predictive search helpers

## Hydrogen Context (context.ts)

**Most important file** - initializes all Hydrogen services:

```typescript
export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }
  
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);
  
  const hydrogenContext = createHydrogenContext({
    env, request, cache, waitUntil, session,
    i18n: getLocaleFromRequest(request),
    cart: { queryFragment: CART_QUERY_FRAGMENT },
  }, additionalContext);
  
  return hydrogenContext;
}
```

**Adding custom context**:
```typescript
const additionalContext = {
  cms: await createCMSClient(env),
} as const;

declare global {
  interface HydrogenAdditionalContext extends typeof additionalContext {}
}
```

## GraphQL Fragments (fragments.ts)

Central location for **shared** GraphQL fragments:

```typescript
// Used everywhere cart data needed
export const CART_QUERY_FRAGMENT = `#graphql ...` as const;

// Layout queries
export const HEADER_QUERY = `#graphql ...` as const;
export const FOOTER_QUERY = `#graphql ...` as const;
```

**When to add**: Used by 3+ routes/components, core data structures, layout queries
**When NOT to add**: Route-specific queries, one-off queries

## Session Management (session.ts)

Custom `HydrogenSession` implementation:

```typescript
export class AppSession implements HydrogenSession {
  public isPending = false;  // Tracks uncommitted changes
  
  static async init(request: Request, secrets: string[]) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        sameSite: 'lax',
        secrets,
      },
    });
    return new this(storage, session);
  }
}
```

**Usage**:
```typescript
// Setting
context.session.set('cartId', newCartId); // isPending = true

// Committing (in server.ts)
if (hydrogenContext.session.isPending) {
  response.headers.set('Set-Cookie', await hydrogenContext.session.commit());
}
```

## Internationalization (i18n.ts)

```typescript
export function getLocaleFromRequest(request: Request): I18nBase {
  const domain = new URL(request.url).hostname.split('.').pop()?.toUpperCase();
  return supportedLocales[domain] || {language: 'EN', country: 'US'};
}
```

Used in `createHydrogenContext()` and GraphQL `@inContext` directive.

## Best Practices

- ✅ Validate required env vars early (context.ts)
- ✅ Always use `as const` on GraphQL strings
- ✅ Check `session.isPending` before commit
- ✅ Pass locale to all GraphQL queries
- ❌ Don't hardcode cart fragment (use CART_QUERY_FRAGMENT)
- ❌ Don't skip session.commit() when isPending
- ❌ Don't store secrets in code
