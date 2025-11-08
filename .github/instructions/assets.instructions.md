---
applyTo: "app/assets/**"
---

# Assets Folder Instructions

Static assets bundled with the application (fonts, icons, logo, etc.).

## Purpose

Files in `app/assets/` are:
- **Bundled with the application** (imported directly in code)
- **Processed by Vite** (optimized, hashed filenames)
- **Type-safe** (can be imported with TypeScript)

Files in `public/` are:
- **Served as-is** (no processing, static URLs)
- **Accessed via absolute paths** (`/image.jpg`)

## Current Files

- `favicon.svg` - Site favicon/icon

## Usage Patterns

### Importing Assets

```tsx
// SVG as React component
import LogoSvg from '~/assets/logo.svg?react';
<LogoSvg className="w-8 h-8" />

// SVG as URL string
import logoUrl from '~/assets/logo.svg';
<img src={logoUrl} alt="Logo" />

// Fonts (imported in CSS)
@font-face {
  font-family: 'CustomFont';
  src: url('~/assets/fonts/custom.woff2') format('woff2');
}
```

### Vite Asset Import Queries

```typescript
// As URL string
import assetUrl from './asset.png'

// As raw text
import shaderCode from './shader.glsl?raw'

// As Web Worker
import Worker from './worker.js?worker'

// As inline base64
import inlineSvg from './icon.svg?inline'
```

## Favicon Configuration

In `root.tsx`:

```tsx
import favicon from '~/assets/favicon.svg';

export const links: LinksFunction = () => [
  {rel: 'icon', type: 'image/svg+xml', href: favicon},
];
```

## File Organization

Recommended structure:

```
app/assets/
├── favicon.svg
├── fonts/
│   ├── inter.woff2
│   └── inter-italic.woff2
├── icons/
│   ├── cart.svg
│   ├── search.svg
│   └── user.svg
└── images/
    └── placeholder.svg
```

## Supported Formats

- **Images**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`, `.avif`
- **Fonts**: `.woff`, `.woff2`, `.ttf`, `.otf`
- **Data**: `.json`, `.csv`, `.txt`
- **Shaders**: `.glsl`, `.wgsl`

## Image Optimization

For **Shopify product/collection images**, use Hydrogen's `Image` component:

```tsx
import {Image} from '@shopify/hydrogen';

<Image
  data={product.image}
  sizes="(min-width: 45em) 50vw, 100vw"
/>
```

For **local assets/icons**, import directly:

```tsx
import placeholderImg from '~/assets/images/placeholder.svg';
<img src={placeholderImg} alt="Placeholder" />
```

## Performance Considerations

- ✅ Use SVG for icons and logos (scalable, small file size)
- ✅ Use WOFF2 for fonts (best compression)
- ✅ Keep assets under 10KB when possible (inlined as base64)
- ✅ Use `?inline` query for small SVGs that need CSS manipulation
- ❌ Don't store large images here (use `public/` or Shopify CDN)
- ❌ Don't commit build artifacts

## Asset Loading in Components

```tsx
// Preload critical fonts
export const links: LinksFunction = () => [
  {
    rel: 'preload',
    href: interFont,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
];

// Dynamic imports for code splitting
const HeavyComponent = lazy(() => import('~/assets/heavy-component'));
```

## TypeScript Support

Vite provides type definitions for asset imports. If needed:

```typescript
// env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Custom env vars
}

// Asset modules are auto-typed
declare module '*.svg' {
  const content: string;
  export default content;
}
```

## Best Practices

- ✅ Name assets descriptively (`user-profile-icon.svg`, not `icon1.svg`)
- ✅ Use SVG for logos and icons (scalable, themeable)
- ✅ Optimize assets before committing (ImageOptim, SVGO)
- ✅ Use `?react` for SVGs that need React props
- ❌ Don't store sensitive data in assets
- ❌ Don't use assets for content images (use Shopify CDN)
- ❌ Don't store large binary files (>100KB)

## Migration from Public

If moving from `public/` to `app/assets/`:

```tsx
// Before (public folder)
<img src="/logo.svg" alt="Logo" />

// After (app assets)
import logoUrl from '~/assets/logo.svg';
<img src={logoUrl} alt="Logo" />
```

Benefits: Type safety, bundling, optimization, cache busting.
