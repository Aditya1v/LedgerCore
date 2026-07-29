import { motion } from "framer-motion";

function Card({ children, className = "", ...props }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`
        rounded-2xl
        border
        border-slate-700
        bg-slate-800
        p-6
        shadow-sm
        transition-all
        duration-200
        hover:shadow-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Card;