import {useState} from 'react';
import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Image, Money, CartForm} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {Leaf, Sparkles, Heart, Shield, Droplet, Sun, Moon} from 'lucide-react';
import {HeroCarousel} from '~/components/HeroCarousel';
import {QuantitySelector} from '~/components/QuantitySelector';
import {FeatureCard} from '~/components/FeatureCard';
import {FEATURED_PRODUCT_QUERY, FIRST_PRODUCT_QUERY} from '~/lib/product-queries';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'NoaBea - Premium Botanical Body Cream'},
    {
      name: 'description',
      content:
        'Discover NoaBea Body Cream - A luxurious botanical formula combining ancient wisdom with modern science for radiant, nourished skin.',
    },
  ];
};

export async function loader({context}: Route.LoaderArgs) {
  // Try to fetch the NoaBea Body Cream product, fall back to first available product
  let product = null;
  
  try {
    const result = await context.storefront.query(FEATURED_PRODUCT_QUERY, {
      variables: {
        handle: 'noabea-body-cream',
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    });
    product = result.product;
  } catch (error) {
    // NoaBea product not found, will fetch first available product
  }

  // If no specific product found, get the first available product
  if (!product) {
    const {products} = await context.storefront.query(FIRST_PRODUCT_QUERY, {
      variables: {
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    });
    product = products.nodes[0];
  }

  if (!product) {
    throw new Response('No products found. Please add products to your store.', {status: 404});
  }

  return {product};
}

export default function Homepage() {
  const {product} = useLoaderData<typeof loader>();
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants.nodes[0];
  const isAvailable = selectedVariant?.availableForSale || false;

  const heroSlides = [
    {
      title: 'NoaBea',
      subtitle: 'Natural Skincare',
      description: 'Experience the mystery of nature with our premium botanical cream',
      ctaText: 'Discover More',
      ctaLink: '#product',
      image: 'https://images.unsplash.com/photo-1688413427501-3e4fac58ede1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwc2tpbmNhcmUlMjBjcmVhbSUyMGphcnxlbnwxfHx8fDE3NjI2MjUxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      title: 'Botanical Elegance',
      subtitle: 'Pure & Natural',
      description: 'Crafted with care, inspired by nature\'s finest ingredients',
      ctaText: 'Discover More',
      ctaLink: '#product',
      image: 'https://images.unsplash.com/photo-1509291184726-a860b15972bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBsZWF2ZXMlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2MjYyNTExMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      title: 'Timeless Beauty',
      subtitle: '50ml of Pure Luxury',
      description: 'Unveil the secret to radiant, nourished skin',
      ctaText: 'Discover More',
      ctaLink: '#product',
      image: product.featuredImage?.url || 'https://images.unsplash.com/photo-1556228852-80364e8c2d5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  const features = [
    {
      icon: Leaf,
      title: 'Natural Ingredients',
      description: 'Sourced from the finest botanical gardens, our ingredients are pure and organic',
    },
    {
      icon: Sparkles,
      title: 'Timeless Formula',
      description: 'A secret blend passed through generations, refined for modern elegance',
    },
    {
      icon: Heart,
      title: 'With Love',
      description: 'Handcrafted with care, each jar is a testament to our dedication',
    },
    {
      icon: Shield,
      title: 'Dermatologically Tested',
      description: 'Safe for all skin types, gentle yet effective in every application',
    },
  ];

  const ingredients = [
    'Shea Butter',
    'Jojoba Oil',
    'Vitamin E',
    'Aloe Vera Extract',
    'Lavender Essential Oil',
    'Chamomile Extract',
  ];

  const benefits = [
    'Deep hydration for up to 24 hours',
    'Reduces fine lines and wrinkles',
    'Improves skin elasticity',
    'Soothes and calms irritation',
    'Non-greasy, fast-absorbing formula',
    'Suitable for all skin types',
  ];

  return (
    <div className="min-h-screen bg-[#F5F3F0]">
      {/* Hero Carousel */}
      <section id="home">
        <HeroCarousel slides={heroSlides} />
      </section>

      {/* Product Showcase */}
      <section id="product" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Product Image */}
            <motion.div
              initial={{opacity: 0, x: -30}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true}}
              transition={{duration: 0.8}}
              className="relative"
            >
              <div className="absolute -inset-8 bg-gradient-to-br from-[#8A9A7B]/20 to-transparent rounded-full blur-3xl" />
              {product.featuredImage && (
                <motion.img
                  whileHover={{scale: 1.05, rotate: 2}}
                  transition={{duration: 0.5}}
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  className="relative rounded-lg w-full drop-shadow-2xl"
                />
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{opacity: 0, x: 30}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true}}
              transition={{duration: 0.8}}
            >
              <p className="uppercase tracking-[0.3em] text-[#8A9A7B] mb-4">Premium Botanical Cream</p>
              <h2 className="text-[#4A5943] mb-4">{product.title}</h2>
              <p className="text-[#6B7A64] mb-6 leading-relaxed">
                {product.description || 'A luxurious botanical body cream that combines ancient wisdom with modern science. Each 50ml jar contains a carefully crafted blend of natural ingredients designed to nourish, protect, and reveal your skin\'s natural radiance.'}
              </p>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-4">
                  {selectedVariant?.price && (
                    <Money
                      data={selectedVariant.price}
                      className="text-[#4A5943]"
                    />
                  )}
                  <span className="text-[#8A9A7B] opacity-60">/ 50ml</span>
                </div>
                
                <div className="flex items-center gap-6 mb-6">
                  <div>
                    <p className="text-[#6B7A64] mb-2">Quantity</p>
                    <QuantitySelector
                      quantity={quantity}
                      onIncrease={() => setQuantity(q => q + 1)}
                      onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={!isAvailable}
                    />
                  </div>
                </div>

                <CartForm
                  route="/cart"
                  inputs={{
                    lines: [
                      {
                        merchandiseId: selectedVariant.id,
                        quantity,
                      },
                    ],
                  }}
                  action={CartForm.ACTIONS.LinesAdd}
                >
                  {(fetcher) => (
                    <>
                      <button
                        type="submit"
                        disabled={!isAvailable || fetcher.state !== 'idle'}
                        className="w-full py-4 bg-[#8A9A7B] text-white rounded-full hover:bg-[#6B7A64] transition-all duration-300 hover:scale-105 hover:shadow-lg uppercase tracking-widest mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {!isAvailable
                          ? 'Sold Out'
                          : fetcher.state !== 'idle'
                          ? 'Adding...'
                          : 'Add to Cart'}
                      </button>
                      <Link
                        to="/cart"
                        className="block w-full py-4 bg-[#8A9A7B]/10 text-[#6B7A64] rounded-full hover:bg-[#8A9A7B]/20 transition-all duration-300 uppercase tracking-widest text-center"
                      >
                        Buy Now
                      </Link>
                    </>
                  )}
                </CartForm>
              </div>

              <div className="pt-6 border-t border-[#8A9A7B]/20">
                <p className="text-[#6B7A64] mb-2">
                  <span className="opacity-60">Size:</span> 50ml
                </p>
                <p className="text-[#6B7A64] mb-2">
                  <span className="opacity-60">Texture:</span> Rich, non-greasy cream
                </p>
                <p className="text-[#6B7A64]">
                  <span className="opacity-60">Scent:</span> Delicate lavender & chamomile
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-[#F5F3F0]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
            className="text-center mb-16"
          >
            <p className="uppercase tracking-[0.3em] text-[#8A9A7B] mb-4">Application Ritual</p>
            <h2 className="text-[#4A5943] mb-4">How to Use</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, delay: 0.1}}
              className="text-center p-8 rounded-lg bg-white/50 backdrop-blur-sm"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#8A9A7B]/10 flex items-center justify-center">
                <Droplet className="w-8 h-8 text-[#6B7A64]" />
              </div>
              <h3 className="mb-3">Cleanse</h3>
              <p className="text-[#6B7A64] opacity-80">
                Start with clean, dry skin. A warm shower opens pores for better absorption.
              </p>
            </motion.div>

            <motion.div
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, delay: 0.2}}
              className="text-center p-8 rounded-lg bg-white/50 backdrop-blur-sm"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#8A9A7B]/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-[#6B7A64]" />
              </div>
              <h3 className="mb-3">Apply</h3>
              <p className="text-[#6B7A64] opacity-80">
                Take a small amount and massage gently in circular motions until fully absorbed.
              </p>
            </motion.div>

            <motion.div
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, delay: 0.3}}
              className="text-center p-8 rounded-lg bg-white/50 backdrop-blur-sm"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#8A9A7B]/10 flex items-center justify-center">
                <div className="relative">
                  <Sun className="w-8 h-8 text-[#6B7A64] absolute" />
                  <Moon className="w-8 h-8 text-[#6B7A64] opacity-30" />
                </div>
              </div>
              <h3 className="mb-3">Enjoy</h3>
              <p className="text-[#6B7A64] opacity-80">
                Use morning and evening for best results. Feel the transformation within days.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ingredients & Benefits */}
      <section className="py-24 px-4 bg-[#F5F3F0]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Ingredients */}
            <motion.div
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.8}}
            >
              <p className="uppercase tracking-[0.3em] text-[#8A9A7B] mb-4">Pure & Natural</p>
              <h2 className="text-[#4A5943] mb-6">Key Ingredients</h2>
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <motion.div
                    key={ingredient}
                    initial={{opacity: 0, x: -20}}
                    whileInView={{opacity: 1, x: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5, delay: index * 0.1}}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-300"
                  >
                    <Leaf className="w-5 h-5 text-[#8A9A7B]" />
                    <span className="text-[#6B7A64]">{ingredient}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.8, delay: 0.2}}
            >
              <p className="uppercase tracking-[0.3em] text-[#8A9A7B] mb-4">Experience</p>
              <h2 className="text-[#4A5943] mb-6">Benefits</h2>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{opacity: 0, x: -20}}
                    whileInView={{opacity: 1, x: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5, delay: index * 0.1}}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 text-[#8A9A7B]" />
                    <span className="text-[#6B7A64]">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-gradient-to-b from-[#F5F3F0] to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <div className="order-2 md:order-1">
              <motion.p
                initial={{opacity: 0}}
                whileInView={{opacity: 1}}
                viewport={{once: true}}
                transition={{duration: 0.8, delay: 0.2}}
                className="uppercase tracking-[0.3em] text-[#8A9A7B] mb-4"
              >
                Our Story
              </motion.p>
              <motion.h2
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.8, delay: 0.3}}
                className="text-[#4A5943] mb-6"
              >
                A Journey Through Nature's Mysteries
              </motion.h2>
              <motion.p
                initial={{opacity: 0}}
                whileInView={{opacity: 1}}
                viewport={{once: true}}
                transition={{duration: 0.8, delay: 0.4}}
                className="text-[#6B7A64] mb-6 leading-relaxed"
              >
                NoaBea was born from a timeless secret, whispered through generations of botanical wisdom. Each jar holds the essence of nature's most guarded treasures, carefully extracted and blended with reverence for the earth.
              </motion.p>
              <motion.p
                initial={{opacity: 0}}
                whileInView={{opacity: 1}}
                viewport={{once: true}}
                transition={{duration: 0.8, delay: 0.5}}
                className="text-[#6B7A64] leading-relaxed"
              >
                We believe beauty is a ritual, a moment of connection between you and the natural world. Every ingredient tells a story of pristine gardens, moonlit harvests, and ancient knowledge.
              </motion.p>
            </div>
            <motion.div
              initial={{opacity: 0, scale: 0.95}}
              whileInView={{opacity: 1, scale: 1}}
              viewport={{once: true}}
              transition={{duration: 0.8, delay: 0.2}}
              className="relative order-1 md:order-2"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-[#8A9A7B]/20 to-transparent rounded-lg blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1509291184726-a860b15972bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBsZWF2ZXMlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2MjYyNTExMXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Botanical Leaves"
                className="relative rounded-lg shadow-2xl w-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
            className="text-center mb-16"
          >
            <p className="uppercase tracking-[0.3em] text-[#8A9A7B] mb-4">Why Choose NoaBea</p>
            <h2 className="text-[#4A5943]">Crafted with Purpose</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-4 bg-[#8A9A7B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            // src="https://images.unsplash.com/photo-1509291184726-a860b15972bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBsZWF2ZXMlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2MjYyNTExMXww&ixlib=rb-4.1.0&q=80&w=1080"
            src="https://images.unsplash.com/photo-1754920236277-ffbfb1eb4a91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBsZWF2ZXMlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2MjYyNTExMXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Botanical Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
          >
            <h2 className="mb-4">Join Our Circle</h2>
            <p className="mb-8 opacity-90">
              Receive exclusive insights into our botanical secrets and be the first to discover new creations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto items-center">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 w-full sm:w-auto px-6 py-4 bg-white/10 backdrop-blur-md text-white placeholder:text-white/60 focus:outline-none transition-all duration-300 text-center"
                style={{
                  margin: 0,
                  borderRadius: '9999px',
                  border: '0.8px solid rgba(255, 255, 255, 0.3)',
                }}
              />
              <button 
                className="bg-white text-[#6B7A64] hover:bg-white/90 transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center"
                style={{
                  margin: 0,
                  padding: "0rem 1rem",
                  borderRadius: '9999px',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  height: '2.8rem',
                }}
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 px-4 bg-[#4A5943] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-6 h-6" />
                <span className="tracking-[0.2em]">NOABEA</span>
              </div>
              <p className="opacity-80">Natural skincare crafted with botanical wisdom</p>
            </div>
            <div>
              <h4 className="mb-4">Shop</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#product" className="hover:opacity-100 transition-opacity">NoaBea Cream</a></li>
                <li><Link to="/collections/all" className="hover:opacity-100 transition-opacity">Gift Options</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">About</h4>
              <ul className="space-y-2 opacity-80">
                <li><a href="#about" className="hover:opacity-100 transition-opacity">Our Story</a></li>
                <li><a href="#ingredients" className="hover:opacity-100 transition-opacity">Ingredients</a></li>
                <li><Link to="/pages/sustainability" className="hover:opacity-100 transition-opacity">Sustainability</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Support</h4>
              <ul className="space-y-2 opacity-80">
                <li><Link to="/pages/contact" className="hover:opacity-100 transition-opacity">Contact Us</Link></li>
                <li><Link to="/policies/shipping-policy" className="hover:opacity-100 transition-opacity">Shipping</Link></li>
                <li><Link to="/policies/refund-policy" className="hover:opacity-100 transition-opacity">Returns</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center opacity-80">
            <p>&copy; 2025 NoaBea. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
