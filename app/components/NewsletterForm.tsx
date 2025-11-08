import {useState} from 'react';
import {motion} from 'framer-motion';

interface NewsletterFormProps {
  onSubmit?: (email: string) => void;
}

export function NewsletterForm({onSubmit}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{duration: 0.8}}
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/30 placeholder:text-white/60 focus:outline-none focus:border-white/60 transition-all duration-300 text-white"
        required
      />
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{scale: 1.05}}
        whileTap={{scale: 0.95}}
        className="px-8 py-4 bg-white text-[#6B7A64] rounded-full hover:bg-white/90 transition-all duration-300 disabled:opacity-50"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </motion.button>
    </motion.form>
  );
}
