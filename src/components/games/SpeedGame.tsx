import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { GameConfig, GameState, GameActions } from "../../types/gameConfig";

interface SpeedGameProps {
  config: GameConfig;
  onNext?: () => void;
  gameState: GameState;
  gameActions: GameActions;
}

// Game-specific data
const SHAPES = ["●", "■", "▲", "♦", "⬡", "★", "♥", "⬟", "◆"];
const COLORS = ["#A987D0", "#EC8BD0", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];

export default function SpeedGame({ config, onNext, gameState, gameActions }: SpeedGameProps) {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [targetColor, setTargetColor] = useState<string>("#A987D0");
  const [screenColor, setScreenColor] = useState<string>("#FDF9F3");
  const [waitingForReaction, setWaitingForReaction] = useState(false);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  const gridSize = 9; // 3x3 grid

  // Handle shape click for shape tapping and color matching
  const handleShapeClick = (index: number) => {
    if (!gameState.gameActive) return;
    
    if (config.id === 'speed-shape-tap') {
      // Shape tapping game
      if (index === highlightedIndex) {
        setScore(prev => prev + 1);
        setHighlightedIndex(Math.floor(Math.random() * gridSize));
      }
    } else if (config.id === 'speed-color-match') {
      // Color matching game
      const shapeColor = COLORS[index % COLORS.length];
      if (shapeColor === targetColor) {
        setScore(prev => prev + 1);
        // Change target color for next round
        setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
      }
    }
  };

  // Handle reaction time game
  const handleReactionClick = () => {
    if (!gameState.gameActive || !waitingForReaction) return;
    
    const reactionTime = Date.now() - reactionStartTime;
    setReactionTimes(prev => [...prev, reactionTime]);
    setWaitingForReaction(false);
    setScore(prev => prev + 1);
  };

  // Auto-generate new highlights for shape tapping
  useEffect(() => {
    if (gameState.gameActive && config.id === 'speed-shape-tap') {
      setHighlightedIndex(Math.floor(Math.random() * gridSize));
      
      const interval = setInterval(() => {
        setHighlightedIndex(Math.floor(Math.random() * gridSize));
      }, 1500);
      
      return () => clearInterval(interval);
    }
  }, [gameState.gameActive, config.id]);

  // Handle reaction time game timing
  const [reactionStartTime, setReactionStartTime] = useState<number>(0);
  useEffect(() => {
    if (gameState.gameActive && config.id === 'speed-reaction') {
      const startReaction = () => {
        setWaitingForReaction(false);
        setScreenColor("#FDF9F3");
        
        // Random delay between 1-4 seconds
        const delay = Math.random() * 3000 + 1000;
        setTimeout(() => {
          setScreenColor("#EC8BD0");
          setWaitingForReaction(true);
          setReactionStartTime(Date.now());
        }, delay);
      };

      startReaction();
      const interval = setInterval(startReaction, 3000);
      return () => clearInterval(interval);
    }
  }, [gameState.gameActive, config.id]);

  const getShapeComponent = (shapeType: string, isHighlighted: boolean, index: number, shapeColor?: string) => {
    const baseClasses = "w-16 h-16 cursor-pointer transition-all duration-200 flex items-center justify-center rounded-2xl border-2";
    const normalClasses = "bg-[#FDF9F3] border-[#A987D0] text-[#A987D0]";
    const highlightedClasses = "bg-[#FDF9F3] border-[#EC8BD0] text-[#EC8BD0] scale-110 shadow-lg ring-4 ring-[#EC8BD0] ring-opacity-50";
    const colorMatchClasses = shapeColor === targetColor ? "ring-4 ring-[#EC8BD0] ring-opacity-50 scale-110" : "";
    
    const classes = `${baseClasses} ${isHighlighted ? highlightedClasses : normalClasses} ${colorMatchClasses}`;

    return (
      <div
        key={index}
        className={classes}
        onClick={() => handleShapeClick(index)}
        style={{ color: shapeColor }}
      >
        <span className="text-2xl">{shapeType}</span>
      </div>
    );
  };

  const renderGameContent = () => {
    switch (config.id) {
      case 'speed-shape-tap':
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl text-[#A987D0] mb-2">
                Tap the highlighted shape as quickly as you can!
              </h1>
              <p className="text-[#A987D0] opacity-75">Score: {score}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {Array.from({ length: gridSize }, (_, index) => {
                const shapeType = SHAPES[index % SHAPES.length];
                const isHighlighted = index === highlightedIndex && gameState.gameActive;
                return getShapeComponent(shapeType, isHighlighted, index);
              })}
            </div>
          </>
        );

      case 'speed-color-match':
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl text-[#A987D0] mb-4">
                Tap shapes that match this color:
              </h1>
              <div 
                className="w-16 h-16 mx-auto rounded-full border-4 border-[#A987D0] mb-4"
                style={{ backgroundColor: targetColor }}
              ></div>
              <p className="text-[#A987D0] opacity-75">Score: {score}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {Array.from({ length: gridSize }, (_, index) => {
                const shapeType = SHAPES[index % SHAPES.length];
                const shapeColor = COLORS[index % COLORS.length];
                const isTargetColor = shapeColor === targetColor;
                return getShapeComponent(shapeType, isTargetColor, index, shapeColor);
              })}
            </div>
          </>
        );

      case 'speed-reaction':
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl text-[#A987D0] mb-4">
                Tap when the screen changes color!
              </h1>
              <p className="text-[#A987D0] opacity-75">
                Score: {score} | Best: {reactionTimes.length > 0 ? Math.min(...reactionTimes) + 'ms' : 'N/A'}
              </p>
            </div>
            <div 
              className="w-96 h-96 mx-auto rounded-3xl border-4 border-[#A987D0] cursor-pointer transition-colors duration-200"
              style={{ backgroundColor: screenColor }}
              onClick={handleReactionClick}
            >
              <div className="flex items-center justify-center h-full">
                <span className="text-4xl text-[#A987D0]">
                  {waitingForReaction ? "TAP NOW!" : "Wait..."}
                </span>
              </div>
            </div>
          </>
        );

      default:
        return <div>Game not implemented</div>;
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {gameState.showInstructions ? (
        /* Instructions Phase */
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl text-[#A987D0] mb-6">
            {config.name}
          </h1>
          <div className="space-y-4 text-lg text-[#A987D0] opacity-90">
            {config.rules.map((rule, index) => (
              <p key={index}>{rule}</p>
            ))}
          </div>
          <div className="mt-8">
            <Button
              onClick={gameActions.startGame}
              className="px-8 py-3 rounded-full border-2 bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3] transition-all"
            >
              Start Game
            </Button>
          </div>
        </div>
      ) : (
        /* Game Phase */
        <>
          {renderGameContent()}

          {/* Next button - only show after game is complete */}
          {!gameState.showInstructions && (
            <Button
              className={`px-8 py-3 rounded-full border-2 transition-all ${
                gameState.gameActive
                  ? "bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] opacity-50 cursor-not-allowed"
                  : "bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
              }`}
              onClick={onNext}
              disabled={gameState.gameActive}
            >
              Next → Focus Challenge
            </Button>
          )}

          {/* Game over message */}
          {!gameState.gameActive && (
            <div className="mt-4 text-center">
              <p className="text-[#A987D0] opacity-75">
                {config.id === 'speed-reaction' 
                  ? `Great job! Your best reaction time was ${reactionTimes.length > 0 ? Math.min(...reactionTimes) + 'ms' : 'N/A'}.`
                  : `Great job! You scored ${score} points in ${config.timeLimit} seconds.`
                }
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
