import {Minus, Plus} from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
        className="w-10 h-10 rounded-full bg-[#8A9A7B]/10 flex items-center justify-center hover:bg-[#8A9A7B]/20 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4 text-[#6B7A64]" />
      </button>
      <span className="w-12 text-center text-[#4A5943]">{quantity}</span>
      <button
        onClick={onIncrease}
        disabled={disabled}
        className="w-10 h-10 rounded-full bg-[#8A9A7B]/10 flex items-center justify-center hover:bg-[#8A9A7B]/20 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4 text-[#6B7A64]" />
      </button>
    </div>
  );
}
