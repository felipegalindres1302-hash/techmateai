import { motion } from 'framer-motion';

const ProgressBar = ({
  progress = 0,
  label,
  color = 'primary',
  showPercentage = true,
  height = 'h-4',
}) => {
  const safeProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const colorGradients = {
    primary: 'from-primary-400 to-primary-600',
    secondary: 'from-secondary-400 to-secondary-600',
    accent: 'from-accent-400 to-accent-600',
    success: 'from-green-400 to-emerald-600',
  };

  const gradient = colorGradients[color] || colorGradients.primary;

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1 text-sm font-display font-semibold text-dark">
          {label && <span>{label}</span>}
          {showPercentage && <span className="text-primary-600">{safeProgress}%</span>}
        </div>
      )}
      <div className={`w-full bg-blue-100/60 rounded-full overflow-hidden ${height} p-0.5 border border-primary-200`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${safeProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

