---
applyTo: "app/styles/**"
---

# Styles Folder Instructions

CSS files for the storefront using Tailwind CSS with custom stylesheets.

## Files

- `tailwind.css` - Tailwind CSS entry point
- `app.css` - Custom application styles
- `reset.css` - CSS reset/normalize

## Tailwind CSS (Primary)

Configured via `vite.config.ts` (Tailwind v4):

```typescript
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), /* ... */],
});
```

**No configuration file needed** - v4 auto-detects usage.

## Loading Order (root.tsx)

```tsx
<head>
  <link rel="stylesheet" href={tailwindCss} />
  <link rel="stylesheet" href={resetStyles} />
  <link rel="stylesheet" href={appStyles} />
</head>
```

Order: Tailwind → Reset → App-specific

## Styling Patterns

### Utility-First (Preferred)

```tsx
<button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
  Add to Cart
</button>

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

### Component Classes (When Needed)

```css
/* In app.css */
.product-card {
  @apply border rounded-lg p-4;
  transition: box-shadow 0.2s;
}
```

### Responsive Design

```tsx
<div className="text-sm md:text-base lg:text-lg xl:text-xl">
  Responsive text
</div>

<nav className="hidden md:block">Desktop Nav</nav>
<nav className="block md:hidden">Mobile Nav</nav>
```

## Animations

```tsx
// Tailwind transitions
<button className="transition-colors duration-200 hover:bg-blue-600">

// Custom animations (app.css)
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.aside.expanded {
  animation: slideIn 0.3s ease-out;
}
```

## Aside/Drawer Styling

```css
.overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

.overlay.expanded {
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.5);
}

.overlay aside {
  transform: translateX(100%);
  transition: transform 0.3s;
}

.overlay.expanded aside {
  transform: translateX(0);
}
```

## Best Practices

- ✅ Use Tailwind utilities for most styling
- ✅ Limit custom CSS to complex patterns
- ✅ Prefer system fonts or limit custom fonts
- ❌ Don't duplicate Tailwind utilities in custom CSS
- ❌ Don't use `!important` unless necessary
