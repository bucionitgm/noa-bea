import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import type {FetcherWithComponents} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  return (
    <div aria-labelledby="cart-summary" className="space-y-4">
      <div className="flex justify-between items-center text-lg">
        <span className="font-medium text-[#4A5943]">Subtotal</span>
        <span className="font-medium text-[#4A5943]">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>
      {/* <CartDiscounts discountCodes={cart?.discountCodes} /> */}
      {/* <CartGiftCard giftCardCodes={cart?.appliedGiftCards} /> */}
      <p className="text-sm text-[#6B7A64]">Shipping and taxes calculated at checkout</p>
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <a 
      href={checkoutUrl} 
      target="_self"
      className="block w-full px-8 py-4 bg-[#8A9A7B] text-white text-center rounded-full hover:bg-[#6B7A64] transition-all duration-300 hover:scale-105 font-medium"
    >
      Continue to Checkout
    </a>
  );
}

// Keeping discount codes, just in case

// function CartDiscounts({
//   discountCodes,
// }: {
//   discountCodes?: CartApiQueryFragment['discountCodes'];
// }) {
//   const codes: string[] =
//     discountCodes
//       ?.filter((discount) => discount.applicable)
//       ?.map(({code}) => code) || [];

//   return (
//     <div className="space-y-3">
//       {/* Have existing discount, display it with a remove option */}
//       {codes.length > 0 && (
//         <div className="bg-[#8A9A7B]/10 rounded-lg p-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-[#4A5943]">Discount applied</p>
//               <code className="text-sm text-[#6B7A64]">{codes?.join(', ')}</code>
//             </div>
//             <UpdateDiscountForm>
//               <button className="text-sm text-[#6B7A64] hover:text-[#4A5943] underline">
//                 Remove
//               </button>
//             </UpdateDiscountForm>
//           </div>
//         </div>
//       )}

//       {/* Show an input to apply a discount */}
//       <UpdateDiscountForm discountCodes={codes}>
//         <div className="flex gap-2">
//           <input 
//             type="text" 
//             name="discountCode" 
//             placeholder="Discount code" 
//             className="flex-1 px-4 py-2 border border-[#8A9A7B]/30 rounded-full text-sm focus:outline-none focus:border-[#8A9A7B] transition-colors"
//           />
//           <button 
//             type="submit"
//             className="px-6 py-2 bg-[#F5F3F0] text-[#6B7A64] rounded-full hover:bg-[#8A9A7B]/10 transition-colors text-sm font-medium"
//           >
//             Apply
//           </button>
//         </div>
//       </UpdateDiscountForm>
//     </div>
//   );
// }

// function UpdateDiscountForm({
//   discountCodes,
//   children,
// }: {
//   discountCodes?: string[];
//   children: React.ReactNode;
// }) {
//   return (
//     <CartForm
//       route="/cart"
//       action={CartForm.ACTIONS.DiscountCodesUpdate}
//       inputs={{
//         discountCodes: discountCodes || [],
//       }}
//     >
//       {children}
//     </CartForm>
//   );
// }

// function CartGiftCard({
//   giftCardCodes,
// }: {
//   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
// }) {
//   const appliedGiftCardCodes = useRef<string[]>([]);
//   const giftCardCodeInput = useRef<HTMLInputElement>(null);
//   const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

//   // Clear the gift card code input after the gift card is added
//   useEffect(() => {
//     if (giftCardAddFetcher.data) {
//       giftCardCodeInput.current!.value = '';
//     }
//   }, [giftCardAddFetcher.data]);

//   function saveAppliedCode(code: string) {
//     const formattedCode = code.replace(/\s/g, ''); // Remove spaces
//     if (!appliedGiftCardCodes.current.includes(formattedCode)) {
//       appliedGiftCardCodes.current.push(formattedCode);
//     }
//   }

//   return (
//     <div>
//       {/* Display applied gift cards with individual remove buttons */}
//       {giftCardCodes && giftCardCodes.length > 0 && (
//         <dl>
//           <dt>Applied Gift Card(s)</dt>
//           {giftCardCodes.map((giftCard) => (
//             <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
//               <div className="cart-discount">
//                 <code>***{giftCard.lastCharacters}</code>
//                 &nbsp;
//                 <Money data={giftCard.amountUsed} />
//                 &nbsp;
//                 <button type="submit">Remove</button>
//               </div>
//             </RemoveGiftCardForm>
//           ))}
//         </dl>
//       )}

//       {/* Show an input to apply a gift card */}
//       <UpdateGiftCardForm
//         giftCardCodes={appliedGiftCardCodes.current}
//         saveAppliedCode={saveAppliedCode}
//         fetcherKey="gift-card-add"
//       >
//         <div>
//           <input
//             type="text"
//             name="giftCardCode"
//             placeholder="Gift card code"
//             ref={giftCardCodeInput}
//           />
//           &nbsp;
//           <button type="submit" disabled={giftCardAddFetcher.state !== 'idle'}>
//             Apply
//           </button>
//         </div>
//       </UpdateGiftCardForm>
//     </div>
//   );
// }

// function UpdateGiftCardForm({
//   giftCardCodes,
//   saveAppliedCode,
//   fetcherKey,
//   children,
// }: {
//   giftCardCodes?: string[];
//   saveAppliedCode?: (code: string) => void;
//   fetcherKey?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <CartForm
//       fetcherKey={fetcherKey}
//       route="/cart"
//       action={CartForm.ACTIONS.GiftCardCodesUpdate}
//       inputs={{
//         giftCardCodes: giftCardCodes || [],
//       }}
//     >
//       {(fetcher: FetcherWithComponents<any>) => {
//         const code = fetcher.formData?.get('giftCardCode');
//         if (code && saveAppliedCode) {
//           saveAppliedCode(code as string);
//         }
//         return children;
//       }}
//     </CartForm>
//   );
// }

// function RemoveGiftCardForm({
//   giftCardId,
//   children,
// }: {
//   giftCardId: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <CartForm
//       route="/cart"
//       action={CartForm.ACTIONS.GiftCardCodesRemove}
//       inputs={{
//         giftCardCodes: [giftCardId],
//       }}
//     >
//       {children}
//     </CartForm>
//   );
// }
