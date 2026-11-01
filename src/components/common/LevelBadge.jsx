import { getLevelProgress } from '../../utils/helpers';
import ProgressBar from './ProgressBar';

const LevelBadge = ({ totalPoints = 0, showProgress = true }) => {
  const { currentLevel, nextLevel, progress } = getLevelProgress(totalPoints);

  return (
    <div className="bg-white rounded-3xl p-4 shadow-md border-2 border-primary-100 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-400 to-amber-300 flex items-center justify-center text-2xl shadow">
          {currentLevel.emoji}
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase font-display font-semibold tracking-wider text-primary-500">
            Nivel {currentLevel.level}
          </p>
          <h3 className="font-display font-bold text-dark text-lg">
            {currentLevel.label}
          </h3>
        </div>
        <div className="text-right">
          <span className="font-display font-bold text-accent-600 text-lg">
            ⭐ {totalPoints}
          </span>
          <p className="text-xs text-gray-500">puntos</p>
        </div>
      </div>

      {showProgress && nextLevel && (
        <div className="mt-1">
          <ProgressBar
            progress={progress}
            label={`Siguiente: ${nextLevel.label} (${nextLevel.minPoints} pts)`}
            color="accent"
            height="h-2.5"
          />
        </div>
      )}
    </div>
  );
};

export default LevelBadge;

