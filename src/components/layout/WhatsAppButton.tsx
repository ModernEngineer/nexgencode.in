import { motion } from 'framer-motion';
import { whatsappLink } from '../../data/contact';

export default function WhatsAppButton() {
  const href = whatsappLink();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.6 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.94 }}
      className="group fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping" />
      <svg viewBox="0 0 32 32" fill="currentColor" className="relative h-7 w-7">
        <path d="M16.004 2.667c-7.363 0-13.333 5.97-13.333 13.333 0 2.352.615 4.646 1.782 6.667L2.667 29.333l6.84-1.793a13.28 13.28 0 0 0 6.497 1.686h.006c7.362 0 13.333-5.97 13.333-13.333 0-3.56-1.387-6.907-3.905-9.425a13.24 13.24 0 0 0-9.434-3.801Zm0 24.4h-.005a11.06 11.06 0 0 1-5.64-1.545l-.405-.24-4.06 1.065 1.084-3.958-.264-.407a11.05 11.05 0 0 1-1.696-5.887c0-6.114 4.975-11.089 11.09-11.089a11.02 11.02 0 0 1 7.843 3.256 11.02 11.02 0 0 1 3.243 7.84c-.003 6.115-4.978 11.09-11.09 11.09Zm6.083-8.302c-.333-.167-1.97-.972-2.275-1.083-.305-.111-.527-.166-.75.167-.222.333-.86 1.083-1.055 1.305-.194.223-.388.25-.72.084-.333-.167-1.406-.519-2.68-1.653-.99-.883-1.66-1.974-1.854-2.307-.194-.334-.02-.514.146-.68.15-.15.334-.39.5-.584.167-.195.223-.334.334-.556.111-.223.056-.417-.028-.584-.083-.167-.75-1.806-1.028-2.473-.27-.65-.545-.562-.75-.573l-.639-.011c-.222 0-.583.083-.888.417-.306.333-1.167 1.14-1.167 2.78 0 1.64 1.195 3.223 1.361 3.446.167.222 2.35 3.59 5.694 5.034.796.343 1.417.548 1.902.702.799.254 1.526.218 2.101.132.641-.096 1.972-.806 2.25-1.585.278-.778.278-1.446.195-1.585-.084-.14-.306-.223-.639-.39Z" />
      </svg>
    </motion.a>
  );
}
