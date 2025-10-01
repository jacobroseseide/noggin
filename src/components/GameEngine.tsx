import { useState, useEffect, ReactNode } from "react";
import { Progress } from "./ui/progress";
import { GameConfig, GameResult, GameState } from "../types/gameConfig";

interface GameEngineProps {
  config: GameConfig;
  onComplete: (result: GameResult) => void;
  onNext?: () => void;
  children: (gameState: GameState, gameActions: GameActions) => ReactNode;
}

interface GameActions {
  startGame: () => void;
  endGame: () => void;
  updateScore: (newScore: number) => void;
  setGameActive: (active: boolean) => void;
  setShowInstructions: (show: boolean) => void;
}

export default function GameEngine({ config, onComplete, children }: GameEngineProps) {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'instructions',
    timeLeft: config.timeLimit,
    score: 0,
    gameActive: false,
    showInstructions: true
  });

  // Handle start button click
  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      showInstructions: false,
      gameActive: true,
      phase: 'playing'
    }));
  };

  // Handle game end
  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      gameActive: false,
      phase: 'complete'
    }));

    // Create game result
    const result: GameResult = {
      gameId: config.id,
      score: gameState.score,
      timeSpent: config.timeLimit - gameState.timeLeft,
      completed: true,
      accuracy: gameState.score > 0 ? 100 : 0
    };

    onComplete(result);
  };

  // Update score
  const updateScore = (newScore: number) => {
    setGameState(prev => ({ ...prev, score: newScore }));
  };

  // Set game active state
  const setGameActive = (active: boolean) => {
    setGameState(prev => ({ ...prev, gameActive: active }));
  };

  // Set instructions visibility
  const setShowInstructions = (show: boolean) => {
    setGameState(prev => ({ ...prev, showInstructions: show }));
  };

  // Timer effect
  useEffect(() => {
    if (gameState.timeLeft > 0 && gameState.gameActive) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0 && gameState.gameActive) {
      endGame();
    }
  }, [gameState.timeLeft, gameState.gameActive]);

  const progressPercentage = gameState.gameActive 
    ? ((config.timeLimit - gameState.timeLeft) / config.timeLimit) * 100 
    : 0;

  const gameActions: GameActions = {
    startGame,
    endGame,
    updateScore,
    setGameActive,
    setShowInstructions
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FDF9F3]"
      style={{ fontFamily: "Anonymous Pro, monospace" }}
    >
      {/* Header with progress bar and step indicator */}
      <header className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[#A987D0] text-lg">{config.name}</div>
          <div className="text-[#A987D0] text-sm opacity-75">
            {config.category.name} Challenge
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-[#A987D0] opacity-75">
            <span>
              {gameState.gameActive ? "Time Remaining" : "Ready to start"}
            </span>
            <span>
              {gameState.gameActive ? `${gameState.timeLeft}s` : "Click Start"}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2 [&>div]:bg-[#EC8BD0]" 
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {children(gameState, gameActions)}
      </main>

      {/* Footer */}
      <footer className="pb-8 px-8">
        <div className="flex justify-center items-center gap-8">
          <a
            href="#"
            className="transition-colors text-sm"
            style={{ color: "#AAAAAA", opacity: "0.75" }}
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="transition-colors text-sm"
            style={{ color: "#AAAAAA", opacity: "0.75" }}
          >
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}


