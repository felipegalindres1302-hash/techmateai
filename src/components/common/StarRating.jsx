import { motion } from 'framer-motion';

const StarRating = ({ stars = 0, maxStars = 3, animated = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const isFilled = index < stars;
        return (
          <motion.span
            key={index}
            className={`${sizeClasses[size] || sizeClasses.md} select-none`}
            initial={animated ? { scale: 0, rotate: -30 } : false}
            animate={animated ? { scale: 1, rotate: 0 } : false}
            transition={{
              delay: animated ? index * 0.15 : 0,
              type: 'spring',
              stiffness: 300,
            }}
          >
            {isFilled ? '⭐' : '⚪'}
          </motion.span>
        );
      })}
    </div>
  );
};

export default StarRating;
