import {motion} from 'framer-motion';
import {Leaf} from 'lucide-react';

interface Ingredient {
  name: string;
}

interface IngredientListProps {
  ingredients: Ingredient[];
}

export function IngredientList({ingredients}: IngredientListProps) {
  return (
    <div className="space-y-3">
      {ingredients.map((ingredient, index) => (
        <motion.div
          key={ingredient.name}
          initial={{opacity: 0, x: -20}}
          whileInView={{opacity: 1, x: 0}}
          viewport={{once: true}}
          transition={{duration: 0.5, delay: index * 0.1}}
          className="flex items-center gap-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-300"
        >
          <Leaf className="w-5 h-5 text-[#8A9A7B]" />
          <span className="text-[#6B7A64]">{ingredient.name}</span>
        </motion.div>
      ))}
    </div>
  );
}
