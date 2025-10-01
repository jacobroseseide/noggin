import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { GameConfig, GameState, GameActions } from "../../types/gameConfig";

interface FocusGameProps {
  config: GameConfig;
  onNext?: () => void;
  gameState: GameState;
  gameActions: GameActions;
}

// Game-specific data
const SHAPES = ["●", "■", "▲", "♦", "⬡", "★", "♥", "⬟", "◆", "▼", "◉", "⬢"];
const COLORS = ["#A987D0", "#EC8BD0", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];
const STROOP_WORDS = ["RED", "BLUE", "GREEN", "YELLOW", "PURPLE", "ORANGE", "PINK", "BROWN"];
const STROOP_COLORS = ["#FF6B6B", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#FF8C42", "#FF69B4", "#8B4513"];

export default function FocusGame({ config, onNext, gameState, gameActions }: FocusGameProps) {
  const [found, setFound] = useState(false);
  const [stroopScore, setStroopScore] = useState(0);
  const [stroopCurrentWord, setStroopCurrentWord] = useState({ word: "", color: "" });
  const [stroopStartTime, setStroopStartTime] = useState<number>(0);

  // Generate grid data for unique shape game
  const { grid, uniqueIndex } = useMemo(() => {
    if (config.id !== 'focus-unique-shape') return { grid: [], uniqueIndex: -1 };
    
    // Create pairs of shapes - we'll have 7 pairs (14 shapes) + 1 unique = 15 total
    const numberOfPairs = 7;
    const shapePairs: string[] = [];
    
    // Add pairs of shapes
    for (let i = 0; i < numberOfPairs; i++) {
      const shape = SHAPES[i % SHAPES.length];
      shapePairs.push(shape, shape); // Add each shape twice to create pairs
    }
    
    // Add one unique shape that doesn't have a pair
    const uniqueShape = SHAPES[numberOfPairs % SHAPES.length];
    shapePairs.push(uniqueShape);
    
    // Shuffle the array to randomize positions
    const shuffled = [...shapePairs].sort(() => Math.random() - 0.5);
    
    // Find the index of the unique shape (the one that appears only once)
    const uniqueShapeValue = uniqueShape;
    const uniqueShapeIndices = shuffled
      .map((shape, index) => ({ shape, index }))
      .filter(item => item.shape === uniqueShapeValue)
      .map(item => item.index);
    
    // The unique shape should only appear once, so take the first (and only) index
    const uniqueShapeIndex = uniqueShapeIndices[0];
    
    // Create grid data with consistent color
    const gridData = shuffled.map((shape, index) => ({
      shape,
      color: "#A987D0", // All shapes same color
      isUnique: index === uniqueShapeIndex
    }));

    return { grid: gridData, uniqueIndex: uniqueShapeIndex };
  }, [config.id]);

  // Generate color focus grid
  const colorGrid = useMemo(() => {
    if (config.id !== 'focus-color-find') return [];
    
    const gridSize = 16; // 4x4 grid
    const grid = [];
    const targetColor = COLORS[0]; // Use first color as target
    let targetCount = 0;
    
    for (let i = 0; i < gridSize; i++) {
      const isTarget = Math.random() < 0.2 && targetCount < 3; // 20% chance, max 3 targets
      if (isTarget) targetCount++;
      
      grid.push({
        shape: SHAPES[i % SHAPES.length],
        color: isTarget ? targetColor : COLORS[(i + 1) % COLORS.length],
        isTarget
      });
    }
    
    return grid;
  }, [config.id]);

  // Handle shape click for unique shape game
  const handleShapeClick = (index: number) => {
    if (!gameState.gameActive || found) return;
    
    if (config.id === 'focus-unique-shape' && index === uniqueIndex) {
      setFound(true);
      gameActions.endGame();
    }
  };

  // Handle color focus game
  const handleColorClick = (index: number) => {
    if (!gameState.gameActive) return;
    
    if (config.id === 'focus-color-find' && colorGrid[index].isTarget) {
      setStroopScore(prev => prev + 1);
      // Mark as found
      colorGrid[index].isTarget = false;
    }
  };

  // Handle Stroop test
  const handleStroopClick = (color: string) => {
    if (!gameState.gameActive) return;
    
    if (config.id === 'focus-stroop') {
      const isCorrect = color === stroopCurrentWord.color;
      if (isCorrect) {
        setStroopScore(prev => prev + 1);
      }
      
      // Generate next word
      const randomWord = STROOP_WORDS[Math.floor(Math.random() * STROOP_WORDS.length)];
      const randomColor = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)];
      setStroopCurrentWord({ word: randomWord, color: randomColor });
    }
  };

  // Initialize Stroop test
  const initializeStroop = () => {
    if (config.id === 'focus-stroop') {
      const randomWord = STROOP_WORDS[Math.floor(Math.random() * STROOP_WORDS.length)];
      const randomColor = STROOP_COLORS[Math.floor(Math.random() * STROOP_COLORS.length)];
      setStroopCurrentWord({ word: randomWord, color: randomColor });
      setStroopStartTime(Date.now());
    }
  };

  const getShapeComponent = (item: { shape: string; color: string; isUnique?: boolean; isTarget?: boolean }, index: number) => {
    const baseClasses = "w-12 h-12 cursor-pointer transition-all duration-200 flex items-center justify-center rounded-2xl border-2";
    const normalClasses = "bg-[#FDF9F3] border-[#A987D0] hover:scale-105";
    const foundClasses = found && item.isUnique ? "bg-[#A987D0] border-[#A987D0] text-[#FDF9F3] scale-110 shadow-lg" : "";
    const targetClasses = item.isTarget ? "ring-4 ring-[#EC8BD0] ring-opacity-50 scale-110" : "";
    
    const classes = `${baseClasses} ${normalClasses} ${foundClasses} ${targetClasses}`;

    return (
      <div
        key={index}
        className={classes}
        onClick={() => handleShapeClick(index)}
      >
        <span 
          className="text-xl transition-colors"
          style={{ color: found && item.isUnique ? "#FDF9F3" : item.color }}
        >
          {item.shape}
        </span>
      </div>
    );
  };

  const getColorComponent = (item: { shape: string; color: string; isTarget: boolean }, index: number) => {
    const baseClasses = "w-12 h-12 cursor-pointer transition-all duration-200 flex items-center justify-center rounded-2xl border-2";
    const normalClasses = "bg-[#FDF9F3] border-[#A987D0] hover:scale-105";
    const targetClasses = item.isTarget ? "ring-4 ring-[#EC8BD0] ring-opacity-50 scale-110" : "";
    
    const classes = `${baseClasses} ${normalClasses} ${targetClasses}`;

    return (
      <div
        key={index}
        className={classes}
        onClick={() => handleColorClick(index)}
      >
        <span 
          className="text-xl transition-colors"
          style={{ color: item.color }}
        >
          {item.shape}
        </span>
      </div>
    );
  };

  const renderGameContent = () => {
    switch (config.id) {
      case 'focus-unique-shape':
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl text-[#A987D0] mb-2">
                Find the shape that appears only once!
              </h1>
              {found && (
                <p className="text-[#A987D0] opacity-75">Great job! You found the unique shape!</p>
              )}
              {!found && !gameState.gameActive && (
                <p className="text-[#A987D0] opacity-75">Time's up! The unique shape was highlighted.</p>
              )}
            </div>
            <div className="grid grid-cols-5 gap-3 mb-8 max-w-lg mx-auto">
              {grid.map((item, index) => getShapeComponent(item, index))}
            </div>
          </>
        );

      case 'focus-color-find':
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl text-[#A987D0] mb-4">
                Find shapes of this color:
              </h1>
              <div 
                className="w-16 h-16 mx-auto rounded-full border-4 border-[#A987D0] mb-4"
                style={{ backgroundColor: COLORS[0] }}
              ></div>
              <p className="text-[#A987D0] opacity-75">Found: {stroopScore}</p>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-8 max-w-md mx-auto">
              {colorGrid.map((item, index) => getColorComponent(item, index))}
            </div>
          </>
        );

      case 'focus-stroop':
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl text-[#A987D0] mb-4">
                Say the COLOR of the word, not the word itself!
              </h1>
              <p className="text-[#A987D0] opacity-75">Score: {stroopScore}</p>
            </div>
            <div className="max-w-md mx-auto mb-8">
              <div className="bg-[#FDF9F3] border-2 border-[#A987D0] rounded-2xl p-8 text-center">
                <p 
                  className="text-4xl font-bold mb-4"
                  style={{ color: stroopCurrentWord.color }}
                >
                  {stroopCurrentWord.word}
                </p>
                <p className="text-[#A987D0] opacity-75 text-sm">
                  Click the color of the text (not the word)
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {STROOP_COLORS.map((color, index) => (
                <Button
                  key={index}
                  className="w-16 h-16 rounded-full border-2 transition-all"
                  style={{ backgroundColor: color }}
                  onClick={() => handleStroopClick(color)}
                >
                  <span className="text-white text-xs font-bold">
                    {color === "#FF6B6B" ? "RED" : 
                     color === "#45B7D1" ? "BLUE" :
                     color === "#96CEB4" ? "GREEN" :
                     color === "#FFEAA7" ? "YELLOW" :
                     color === "#DDA0DD" ? "PURPLE" :
                     color === "#FF8C42" ? "ORANGE" :
                     color === "#FF69B4" ? "PINK" : "BROWN"}
                  </span>
                </Button>
              ))}
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
              onClick={() => {
                gameActions.startGame();
                initializeStroop();
              }}
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
                gameState.gameActive && !found
                  ? "bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] opacity-50 cursor-not-allowed"
                  : "bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
              }`}
              onClick={onNext}
              disabled={gameState.gameActive && !found}
            >
              Next → Logic Challenge
            </Button>
          )}

          {/* Success message */}
          {!gameState.showInstructions && found && (
            <div className="mt-4 text-center">
              <p className="text-[#A987D0] opacity-75">
                Excellent focus! You found it with {gameState.timeLeft} seconds remaining.
              </p>
            </div>
          )}

          {/* Stroop test completion message */}
          {!gameState.showInstructions && config.id === 'focus-stroop' && !gameState.gameActive && (
            <div className="mt-4 text-center">
              <p className="text-[#A987D0] opacity-75">
                Great job! You correctly identified {stroopScore} colors in {config.timeLimit} seconds.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
