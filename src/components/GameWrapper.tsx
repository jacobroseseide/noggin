import { GameConfig, GameResult } from "../types/gameConfig";
import GameEngine from "./GameEngine";
import LogicGame from "./games/LogicGame";
import SpeedGame from "./games/SpeedGame";
import FocusGame from "./games/FocusGame";
import MemoryGame from "./games/MemoryGame";

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
      
      case 'speed-shape-tap':
      case 'speed-color-match':
      case 'speed-reaction':
        return (
          <SpeedGame
            config={config}
            onNext={onNext}
            gameState={gameState}
            gameActions={gameActions}
          />
        );
      
      case 'focus-unique-shape':
      case 'focus-color-find':
      case 'focus-stroop':
        return (
          <FocusGame
            config={config}
            onNext={onNext}
            gameState={gameState}
            gameActions={gameActions}
          />
        );
      
      case 'memory-sequence':
      case 'memory-spatial':
      case 'memory-number':
        return (
          <MemoryGame
            config={config}
            onNext={onNext}
            gameState={gameState}
            gameActions={gameActions}
          />
        );
      
      // All game types are now implemented!
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
