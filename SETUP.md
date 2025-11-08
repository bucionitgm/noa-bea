# NoaBea Shopify Setup Guide

This guide will help you set up your Shopify store to work with the NoaBea design implementation.

## Prerequisites

- A Shopify store with admin access
- The NoaBea Hydrogen storefront project running locally

## Product Setup

### 1. Create the NoaBea Body Cream Product

1. Log in to your Shopify Admin
2. Go to **Products** > **Add product**
3. Fill in the following information:

#### Basic Information
- **Title:** NoaBea Body Cream
- **Description:** 
  ```
  A luxurious botanical body cream that combines ancient wisdom with modern science. 
  Each 50ml jar contains a carefully crafted blend of natural ingredients designed to 
  nourish, protect, and reveal your skin's natural radiance.
  ```
- **Price:** $48.00
- **SKU:** NOABEA-CREAM-50ML
- **Barcode:** (Optional)
- **Weight:** 50g
- **Product handle:** `noabea-body-cream` (Important! This must match the handle in the code)

#### Images
Upload the product images from `public/images/hero-carousel.jpg` or your own high-quality product images.

#### Inventory
- **Track quantity:** Yes
- **Quantity:** Set your initial stock level
- **Continue selling when out of stock:** No (recommended)

#### Variants
- Create a single variant (50ml size)
- Price: $48.00

### 2. Add Product Metafields (Optional but Recommended)

To add custom product information, create these metafields in Shopify:

1. Go to **Settings** > **Custom data** > **Products**
2. Add the following metafield definitions:

#### Size
- **Namespace and key:** `custom.size`
- **Type:** Single line text
- **Value:** `50ml`

#### Texture
- **Namespace and key:** `custom.texture`
- **Type:** Single line text
- **Value:** `Rich, non-greasy cream`

#### Scent
- **Namespace and key:** `custom.scent`
- **Type:** Single line text
- **Value:** `Delicate lavender & chamomile`

#### Ingredients (Optional)
- **Namespace and key:** `custom.ingredients`
- **Type:** Multi-line text
- **Value:** 
  ```
  Shea Butter, Jojoba Oil, Vitamin E, Aloe Vera Extract, 
  Lavender Essential Oil, Chamomile Extract
  ```

#### Benefits (Optional)
- **Namespace and key:** `custom.benefits`
- **Type:** Multi-line text
- **Value:** 
  ```
  Deep hydration for up to 24 hours
  Reduces fine lines and wrinkles
  Improves skin elasticity
  Soothes and calms irritation
  Non-greasy, fast-absorbing formula
  Suitable for all skin types
  ```

### 3. Create Collections (Optional)

1. Go to **Products** > **Collections** > **Create collection**
2. Create a collection named "Body Care" or "Featured Products"
3. Add the NoaBea Body Cream to this collection

### 4. Menu Setup

#### Main Menu (Header)
The header is simplified in the NoaBea design, showing only the logo and cart icon.

#### Footer Menu
1. Go to **Online Store** > **Navigation** > **Footer menu**
2. Create or update the footer menu with these sections:

**Shop**
- NoaBea Cream → Link to `/products/noabea-body-cream`
- Gift Options → Link to `/collections/all`

**About**
- Our Story → Link to `#story` (anchor link)
- Ingredients → Link to `#ingredients` (anchor link)
- Sustainability → Link to `/pages/sustainability` (create this page)

**Support**
- Contact Us → Link to `/pages/contact` (create this page)
- Shipping → Link to `/policies/shipping-policy`
- Returns → Link to `/policies/refund-policy`

## Environment Variables

Make sure your `.env` file contains the following variables:

```bash
SESSION_SECRET=your_session_secret_here
PUBLIC_STOREFRONT_API_TOKEN=your_storefront_api_token
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_CHECKOUT_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_ID=gid://shopify/Shop/YOUR_SHOP_ID
```

## Running the Development Server

```bash
npm run dev
```

This will start the Hydrogen development server with GraphQL codegen enabled.

## Testing the Integration

1. Visit `http://localhost:3000` in your browser
2. You should see the NoaBea homepage with:
   - Hero carousel with product image
   - Product details section
   - Add to cart functionality
   - How to use section
   - Ingredients and benefits
   - Brand story
   - Feature highlights
   - Newsletter subscription
   - Footer

### Testing Cart Functionality

1. Click "Add to Cart" button
2. The cart drawer should open on the right side
3. Verify the product is added with correct quantity and price
4. Test quantity updates
5. Test checkout button

## Troubleshooting

### Product Not Found Error
- Verify the product handle in Shopify matches `noabea-body-cream`
- Check that the product is published to your online store channel

### Images Not Loading
- Make sure images are uploaded to Shopify for the product
- Check that the images in `public/images/` are accessible

### Cart Not Working
- Verify the Storefront API token has cart permissions
- Check browser console for errors

### Styling Issues
- Run `npm run codegen` to ensure GraphQL types are generated
- Clear browser cache and hard reload

## Customization

### Changing Product Handle
If you want to use a different product handle, update line 35 in `app/routes/_index.tsx`:

```typescript
handle: 'your-custom-handle', // Change this
```

### Adjusting Colors
The NoaBea color palette is defined in `app/styles/tailwind.css`:

```css
@theme {
  --color-sage-light: #8a9a7b;
  --color-sage-medium: #6b7a64;
  --color-sage-dark: #4a5943;
  --color-sage-darker: #3a4933;
  --color-cream: #f5f3f0;
}
```

### Hero Carousel
To add more slides, modify the `heroSlides` array in `app/routes/_index.tsx`:

```typescript
const heroSlides = [
  {
    title: 'Timeless Beauty',
    subtitle: '50ml of Pure Luxury',
    description: 'Unveil the secret to radiant, nourished skin',
    ctaText: 'Discover More',
    ctaLink: '#product',
    image: product.featuredImage?.url || '/images/hero-carousel.jpg',
  },
  // Add more slides here
];
```

## Production Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Shopify Oxygen:
   ```bash
   shopify hydrogen deploy
   ```

3. Verify the deployment in your Shopify admin

## Support

For issues or questions:
- Check the Hydrogen documentation: https://shopify.dev/docs/custom-storefronts/hydrogen
- Review the React Router documentation: https://reactrouter.com/
- Check the project's GitHub issues

## Next Steps

1. Add more products to your store
2. Create additional pages (About, Contact, Sustainability)
3. Set up email marketing integration for newsletter
4. Configure shipping and payment options
5. Test the complete checkout flow
6. Optimize images for web performance
7. Set up analytics and tracking
