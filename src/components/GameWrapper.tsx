import { GameConfig, GameResult } from "../types/gameConfig";
import GameEngine from "./GameEngine";
import LogicGame from "./games/LogicGame";

interface GameWrapperProps {
  config: GameConfig;
  onComplete: (result: GameResult) => void;
  onNext?: () => void;
}

export default function GameWrapper({ config, onComplete, onNext }: GameWrapperProps) {
  const renderGame = (gameState: any, gameActions: any) => {
    // Route to appropriate game component based on config.id
    switch (config.id) {
      case 'logic-word-problem':
      case 'logic-pattern':
      case 'logic-spatial':
        return (
          <LogicGame
            config={config}
            onNext={onNext}
            gameState={gameState}
            gameActions={gameActions}
          />
        );
      
      // Add other game types here as we implement them
      default:
        return (
          <div className="text-center">
            <h1 className="text-2xl text-[#A987D0] mb-4">
              Game not implemented yet
            </h1>
            <p className="text-[#A987D0] opacity-75">
              This game type is coming soon!
            </p>
          </div>
        );
    }
  };

  return (
    <GameEngine config={config} onComplete={onComplete}>
      {renderGame}
    </GameEngine>
  );
}
