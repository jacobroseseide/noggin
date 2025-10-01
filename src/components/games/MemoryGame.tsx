import { useState, useEffect, useMemo } from "react";
import { Button } from "../ui/button";
import { GameConfig, GameState, GameActions } from "../../types/gameConfig";

interface MemoryGameProps {
  config: GameConfig;
  onNext?: () => void;
  gameState: GameState;
  gameActions: GameActions;
}

// Game-specific data
const SYMBOLS = ["●", "■", "▲", "♦", "⬡", "★", "♥", "⬟", "◆", "▼", "◉", "⬢"];
const GRID_SIZE = 12; // 3x4 grid for sequence memory
const SPATIAL_GRID_SIZE = 16; // 4x4 grid for spatial memory

export default function MemoryGame({ config, onNext, gameState, gameActions }: MemoryGameProps) {
  const [gamePhase, setGamePhase] = useState<"instructions" | "memorize" | "recreate" | "complete">("instructions");
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [spatialPattern, setSpatialPattern] = useState<boolean[]>([]);
  const [userSpatialPattern, setUserSpatialPattern] = useState<boolean[]>([]);
  const [numberSequence, setNumberSequence] = useState<number[]>([]);
  const [userNumberSequence, setUserNumberSequence] = useState<number[]>([]);
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);

  // Generate sequence memory data
  const { originalSequence, shuffledGrid } = useMemo(() => {
    if (config.id !== 'memory-sequence') return { originalSequence: [], shuffledGrid: [] };
    
    // Create original sequence with unique symbols
    const symbols = SYMBOLS.slice(0, GRID_SIZE);
    const originalSeq = symbols.map((symbol, index) => ({ symbol, originalIndex: index }));
    
    // Create shuffled version for recreation phase
    const shuffled = [...symbols].sort(() => Math.random() - 0.5);
    
    return {
      originalSequence: originalSeq,
      shuffledGrid: shuffled
    };
  }, [config.id]);

  // Generate spatial memory pattern
  const generateSpatialPattern = () => {
    if (config.id !== 'memory-spatial') return [];
    
    const pattern = new Array(SPATIAL_GRID_SIZE).fill(false);
    const numHighlights = Math.floor(Math.random() * 4) + 3; // 3-6 highlights
    
    for (let i = 0; i < numHighlights; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * SPATIAL_GRID_SIZE);
      } while (pattern[randomIndex]);
      pattern[randomIndex] = true;
    }
    
    return pattern;
  };

  // Generate number sequence
  const generateNumberSequence = () => {
    if (config.id !== 'memory-number') return [];
    
    const length = Math.floor(Math.random() * 3) + 4; // 4-6 numbers
    const sequence = [];
    
    for (let i = 0; i < length; i++) {
      sequence.push(Math.floor(Math.random() * 9) + 1); // 1-9
    }
    
    return sequence;
  };

  // Initialize spatial pattern
  useEffect(() => {
    if (config.id === 'memory-spatial') {
      setSpatialPattern(generateSpatialPattern());
    }
  }, [config.id]);

  // Initialize number sequence
  useEffect(() => {
    if (config.id === 'memory-number') {
      setNumberSequence(generateNumberSequence());
    }
  }, [config.id]);

  // Handle start button click
  const handleStartGame = () => {
    setGamePhase("memorize");
    gameActions.startGame();
  };

  // Handle memorization timer
  useEffect(() => {
    if (gamePhase === "memorize" && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        gameActions.setGameActive(false);
        setGamePhase("recreate");
      }, config.timeLimit * 1000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, gameState.timeLeft, config.timeLimit, gameActions]);

  // Handle symbol click during recreation phase (sequence memory)
  const handleSymbolClick = (symbolIndex: number) => {
    if (gamePhase !== "recreate" || config.id !== 'memory-sequence') return;
    
    const clickedSymbol = shuffledGrid[symbolIndex];
    const expectedSymbol = originalSequence[currentStep].symbol;
    
    if (clickedSymbol === expectedSymbol) {
      // Correct symbol clicked
      setUserSequence(prev => [...prev, symbolIndex]);
      setCurrentStep(prev => prev + 1);
      
      // Check if sequence is complete
      if (currentStep + 1 === GRID_SIZE) {
        setGamePhase("complete");
        gameActions.endGame();
      }
    } else {
      // Wrong symbol - end game
      setGamePhase("complete");
      gameActions.endGame();
    }
  };

  // Handle spatial memory click
  const handleSpatialClick = (index: number) => {
    if (gamePhase !== "recreate" || config.id !== 'memory-spatial') return;
    
    setUserSpatialPattern(prev => {
      const newPattern = [...prev];
      newPattern[index] = !newPattern[index];
      return newPattern;
    });
  };

  // Handle number sequence input
  const handleNumberInput = (number: number) => {
    if (gamePhase !== "recreate" || config.id !== 'memory-number') return;
    
    setUserNumberSequence(prev => [...prev, number]);
    setCurrentNumberIndex(prev => prev + 1);
    
    // Check if sequence is complete
    if (currentNumberIndex + 1 === numberSequence.length) {
      setGamePhase("complete");
      gameActions.endGame();
    }
  };

  // Check spatial memory completion
  const checkSpatialCompletion = () => {
    if (config.id !== 'memory-spatial') return;
    
    const isComplete = userSpatialPattern.length === SPATIAL_GRID_SIZE;
    if (isComplete) {
      setGamePhase("complete");
      gameActions.endGame();
    }
  };

  useEffect(() => {
    if (config.id === 'memory-spatial' && userSpatialPattern.length === SPATIAL_GRID_SIZE) {
      checkSpatialCompletion();
    }
  }, [userSpatialPattern, config.id]);

  const getProgressPercentage = () => {
    switch (config.id) {
      case 'memory-sequence':
        return gamePhase === "recreate" ? (currentStep / GRID_SIZE) * 100 : 
               gamePhase === "memorize" ? ((config.timeLimit - gameState.timeLeft) / config.timeLimit) * 100 : 0;
      case 'memory-spatial':
        return gamePhase === "recreate" ? (userSpatialPattern.length / SPATIAL_GRID_SIZE) * 100 :
               gamePhase === "memorize" ? ((config.timeLimit - gameState.timeLeft) / config.timeLimit) * 100 : 0;
      case 'memory-number':
        return gamePhase === "recreate" ? (currentNumberIndex / numberSequence.length) * 100 :
               gamePhase === "memorize" ? ((config.timeLimit - gameState.timeLeft) / config.timeLimit) * 100 : 0;
      default:
        return 0;
    }
  };

  const getScore = () => {
    switch (config.id) {
      case 'memory-sequence':
        return userSequence.length;
      case 'memory-spatial':
        return userSpatialPattern.filter((cell, index) => cell === spatialPattern[index]).length;
      case 'memory-number':
        return userNumberSequence.filter((num, index) => num === numberSequence[index]).length;
      default:
        return 0;
    }
  };

  const getMaxScore = () => {
    switch (config.id) {
      case 'memory-sequence':
        return GRID_SIZE;
      case 'memory-spatial':
        return SPATIAL_GRID_SIZE;
      case 'memory-number':
        return numberSequence.length;
      default:
        return 0;
    }
  };

  const renderGameContent = () => {
    switch (config.id) {
      case 'memory-sequence':
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl text-[#A987D0] mb-4">
                Memory Challenge
              </h1>
              
              {gamePhase === "memorize" && (
                <p className="text-[#A987D0] opacity-75">
                  Memorize the sequence of symbols below
                </p>
              )}
              
              {gamePhase === "recreate" && (
                <p className="text-[#A987D0] opacity-75">
                  Click the symbols in the same order as shown
                </p>
              )}
              
              {gamePhase === "complete" && (
                <p className="text-[#A987D0] opacity-75">
                  {getScore() === getMaxScore() ? "Perfect memory! You got the entire sequence!" : 
                   `Good effort! You remembered ${getScore()} out of ${getMaxScore()} symbols correctly.`}
                </p>
              )}
            </div>

            {/* Game grid */}
            {gamePhase !== "instructions" && (
              <div className="grid grid-cols-4 gap-4 mb-8 max-w-md mx-auto">
                {(gamePhase === "memorize" ? originalSequence.map(item => item.symbol) : shuffledGrid)
                  .map((symbol, index) => {
                    const isClickable = gamePhase === "recreate";
                    const isClicked = userSequence.includes(index);
                    
                    return (
                      <div
                        key={index}
                        className={`w-16 h-16 flex items-center justify-center rounded-2xl border-2 transition-all duration-200 ${
                          isClickable 
                            ? isClicked 
                              ? "bg-[#A987D0] border-[#A987D0] text-[#FDF9F3] cursor-default"
                              : "bg-[#FDF9F3] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3] cursor-pointer"
                            : "bg-[#FDF9F3] border-[#A987D0]"
                        } ${gamePhase === "memorize" ? "animate-pulse" : ""}`}
                        onClick={() => isClickable && !isClicked && handleSymbolClick(index)}
                      >
                        <span className="text-2xl text-[#A987D0] transition-colors">
                          {symbol}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Current step indicator during recreation */}
            {gamePhase === "recreate" && (
              <div className="mb-6 text-center">
                <p className="text-[#A987D0] opacity-75">
                  Next symbol: <span className="text-xl">{originalSequence[currentStep]?.symbol}</span>
                </p>
              </div>
            )}
          </>
        );

      case 'memory-spatial':
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl text-[#A987D0] mb-4">
                Spatial Memory Challenge
              </h1>
              
              {gamePhase === "memorize" && (
                <p className="text-[#A987D0] opacity-75">
                  Memorize the highlighted squares
                </p>
              )}
              
              {gamePhase === "recreate" && (
                <p className="text-[#A987D0] opacity-75">
                  Click the squares that were highlighted
                </p>
              )}
              
              {gamePhase === "complete" && (
                <p className="text-[#A987D0] opacity-75">
                  {getScore() === getMaxScore() ? "Perfect spatial memory!" : 
                   `Good effort! You got ${getScore()} out of ${getMaxScore()} squares correct.`}
                </p>
              )}
            </div>

            {/* Spatial grid */}
            {gamePhase !== "instructions" && (
              <div className="grid grid-cols-4 gap-3 mb-8 max-w-md mx-auto">
                {Array.from({ length: SPATIAL_GRID_SIZE }, (_, index) => {
                  const isHighlighted = gamePhase === "memorize" ? spatialPattern[index] : userSpatialPattern[index];
                  const isClickable = gamePhase === "recreate";
                  
                  return (
                    <div
                      key={index}
                      className={`w-12 h-12 cursor-pointer transition-all duration-200 flex items-center justify-center rounded-2xl border-2 ${
                        isHighlighted
                          ? "bg-[#A987D0] border-[#A987D0] text-[#FDF9F3]"
                          : "bg-[#FDF9F3] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
                      } ${gamePhase === "memorize" ? "animate-pulse" : ""}`}
                      onClick={() => isClickable && handleSpatialClick(index)}
                    >
                      <span className="text-xl">●</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );

      case 'memory-number':
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl text-[#A987D0] mb-4">
                Number Memory Challenge
              </h1>
              
              {gamePhase === "memorize" && (
                <p className="text-[#A987D0] opacity-75">
                  Memorize this sequence of numbers
                </p>
              )}
              
              {gamePhase === "recreate" && (
                <p className="text-[#A987D0] opacity-75">
                  Enter the numbers in the same order
                </p>
              )}
              
              {gamePhase === "complete" && (
                <p className="text-[#A987D0] opacity-75">
                  {getScore() === getMaxScore() ? "Perfect number memory!" : 
                   `Good effort! You got ${getScore()} out of ${getMaxScore()} numbers correct.`}
                </p>
              )}
            </div>

            {/* Number display */}
            {gamePhase === "memorize" && (
              <div className="mb-8">
                <div className="bg-[#FDF9F3] border-2 border-[#A987D0] rounded-2xl p-6 text-center">
                  <div className="text-4xl text-[#A987D0] font-bold animate-pulse">
                    {numberSequence.join(" - ")}
                  </div>
                </div>
              </div>
            )}

            {/* Number input */}
            {gamePhase === "recreate" && (
              <div className="mb-8">
                <div className="text-center mb-4">
                  <p className="text-[#A987D0] opacity-75">
                    Enter number {currentNumberIndex + 1} of {numberSequence.length}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                    <Button
                      key={number}
                      className="w-16 h-16 text-2xl font-bold rounded-full border-2 bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
                      onClick={() => handleNumberInput(number)}
                    >
                      {number}
                    </Button>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <p className="text-[#A987D0] opacity-75">
                    Sequence so far: {userNumberSequence.join(" - ")}
                  </p>
                </div>
              </div>
            )}
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
              onClick={handleStartGame}
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
          {gamePhase === "complete" && (
            <Button
              className="px-8 py-3 rounded-full border-2 transition-all bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
              onClick={onNext}
            >
              See Results
            </Button>
          )}

          {/* Score display */}
          {gamePhase === "complete" && (
            <div className="mt-6 text-center">
              <div className="bg-[#FDF9F3] border-2 border-[#A987D0] rounded-2xl p-4">
                <p className="text-[#A987D0] text-lg mb-2">Your Score</p>
                <p className="text-2xl text-[#A987D0]">
                  {getScore()}/{getMaxScore()}
                </p>
                <p className="text-sm text-[#A987D0] opacity-75 mt-1">
                  {Math.round((getScore() / getMaxScore()) * 100)}% accuracy
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
