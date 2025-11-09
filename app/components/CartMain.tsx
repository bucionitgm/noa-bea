import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {motion} from 'framer-motion';
import {ShoppingBag} from 'lucide-react';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className="flex flex-col h-full">
      <CartEmpty hidden={linesCount} layout={layout} />
      {linesCount && (
        <>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {(cart?.lines?.nodes ?? []).map((line) => (
                <CartLineItem key={line.id} line={line} layout={layout} />
              ))}
            </div>
          </div>
          {cartHasItems && (
            <div className="border-t border-[#8A9A7B]/20 px-6 py-4">
              <CartSummary cart={cart} layout={layout} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="flex flex-col items-center justify-center h-full px-6 text-center">
      <motion.div
        initial={{scale: 0.8, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.3}}
      >
        <div className="w-20 h-20 rounded-full bg-[#8A9A7B]/10 flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-[#6B7A64]" />
        </div>
        <h3 className="text-xl font-medium text-[#4A5943] mb-2">Your cart is empty</h3>
        <p className="text-[#6B7A64] mb-6">
          Looks like you haven't added anything yet
        </p>
        <Link 
          to="/" 
          onClick={close} 
          prefetch="viewport"
          className="inline-block px-8 py-3 bg-[#8A9A7B] text-white rounded-full hover:bg-[#6B7A64] transition-all duration-300"
        >
          Start Shopping
        </Link>
      </motion.div>
    </div>
  );
}
