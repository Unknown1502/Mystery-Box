import { PowerUp, PowerUpType } from '../../../shared/types/realm';

interface Props {
  powerUps: PowerUp[];
  userPoints: number;
  onUsePowerUp: (type: PowerUpType) => void;
  disabled: boolean;
}

export function PowerUpsPanel({ powerUps, userPoints, onUsePowerUp, disabled }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-800">⚡ Power-Ups</h3>
        <div className="bg-yellow-100 px-3 py-1 rounded-full">
          <span className="text-yellow-700 font-bold">💎 {userPoints} points</span>
        </div>
      </div>

      <div className="space-y-3">
        {powerUps.map((powerUp) => {
          const canAfford = userPoints >= powerUp.cost;
          const isDisabled = disabled || !canAfford;

          return (
            <button
              key={powerUp.type}
              onClick={() => onUsePowerUp(powerUp.type)}
              disabled={isDisabled}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                isDisabled
                  ? 'bg-slate-100 border-slate-300 opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 hover:border-purple-500 hover:shadow-md cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{powerUp.icon}</span>
                  <div>
                    <div className="font-bold text-slate-800">{powerUp.name}</div>
                    <div className="text-sm text-slate-600">{powerUp.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-600">{powerUp.cost} pts</div>
                  {!canAfford && (
                    <div className="text-xs text-red-500">Not enough points</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-slate-500 text-center">
        Earn points by solving mysteries correctly
      </div>
    </div>
  );
}
