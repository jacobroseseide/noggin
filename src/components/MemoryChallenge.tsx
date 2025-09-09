import { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface MemoryChallengeProps {
  onNext: () => void;
}

// Game symbols to use
const SYMBOLS = ["●", "■", "▲", "♦", "⬡", "★", "♥", "⬟", "◆", "▼", "◉", "⬢"];
const GRID_SIZE = 12; // 3x4 grid

export default function MemoryChallenge({ onNext }: MemoryChallengeProps) {
  const [gamePhase, setGamePhase] = useState<"memorize" | "recreate" | "complete">("memorize");
  const [timeLeft, setTimeLeft] = useState(5); // 5 seconds to memorize
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Generate original sequence and shuffled grid
  const { originalSequence, shuffledGrid } = useMemo(() => {
    // Create original sequence with unique symbols
    const symbols = SYMBOLS.slice(0, GRID_SIZE);
    const originalSeq = symbols.map((symbol, index) => ({ symbol, originalIndex: index }));
    
    // Create shuffled version for recreation phase
    const shuffled = [...symbols].sort(() => Math.random() - 0.5);
    
    return {
      originalSequence: originalSeq,
      shuffledGrid: shuffled
    };
  }, []);

  // Handle memorization timer
  useEffect(() => {
    if (gamePhase === "memorize" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === "memorize" && timeLeft === 0) {
      setGamePhase("recreate");
    }
  }, [timeLeft, gamePhase]);

  // Handle symbol click during recreation phase
  const handleSymbolClick = (symbolIndex: number) => {
    if (gamePhase !== "recreate") return;
    
    const clickedSymbol = shuffledGrid[symbolIndex];
    const expectedSymbol = originalSequence[currentStep].symbol;
    
    if (clickedSymbol === expectedSymbol) {
      // Correct symbol clicked
      setUserSequence(prev => [...prev, symbolIndex]);
      setCurrentStep(prev => prev + 1);
      
      // Check if sequence is complete
      if (currentStep + 1 === GRID_SIZE) {
        setGamePhase("complete");
      }
    } else {
      // Wrong symbol - end game
      setGamePhase("complete");
    }
  };

  const progressPercentage = gamePhase === "memorize" ? ((5 - timeLeft) / 5) * 100 : 100;
  const isCorrectSequence = userSequence.length === GRID_SIZE;

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FDF9F3]"
      style={{ fontFamily: "Anonymous Pro, monospace" }}
    >
      {/* Header with progress bar and step indicator */}
      <header className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[#A987D0] text-lg">Memory Challenge</div>
          <div className="text-[#A987D0] text-sm opacity-75">Step 4 of 4</div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-[#A987D0] opacity-75">
            <span>
              {gamePhase === "memorize" ? "Memorization Time" : 
               gamePhase === "recreate" ? "Recreation Progress" : "Complete"}
            </span>
            <span>
              {gamePhase === "memorize" ? `${timeLeft}s` : 
               gamePhase === "recreate" ? `${currentStep}/${GRID_SIZE}` : "Done"}
            </span>
          </div>
          <Progress 
            value={gamePhase === "recreate" ? (currentStep / GRID_SIZE) * 100 : progressPercentage} 
            className="h-2 [&>div]:bg-[#EC8BD0]" 
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Instructions */}
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
              {isCorrectSequence ? "Perfect memory! You got the entire sequence!" : 
               `Good effort! You remembered ${userSequence.length} out of ${GRID_SIZE} symbols correctly.`}
            </p>
          )}
        </div>

        {/* Game grid */}
        <div className="grid grid-cols-4 gap-4 mb-8 max-w-md">
          {(gamePhase === "memorize" ? originalSequence.map(item => item.symbol) : shuffledGrid)
            .map((symbol, index) => {
              const isClickable = gamePhase === "recreate";
              const isClicked = userSequence.includes(index);
              const isNext = gamePhase === "recreate" && !isClicked;
              
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

        {/* Current step indicator during recreation */}
        {gamePhase === "recreate" && (
          <div className="mb-6 text-center">
            <p className="text-[#A987D0] opacity-75">
              Next symbol: <span className="text-xl">{originalSequence[currentStep]?.symbol}</span>
            </p>
          </div>
        )}

        {/* See Results button */}
        <Button
          className={`px-8 py-3 rounded-full border-2 transition-all ${
            gamePhase !== "complete"
              ? "bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] opacity-50 cursor-not-allowed"
              : "bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
          }`}
          onClick={onNext}
          disabled={gamePhase !== "complete"}
        >
          See Results
        </Button>

        {/* Score display */}
        {gamePhase === "complete" && (
          <div className="mt-6 text-center">
            <div className="bg-[#FDF9F3] border-2 border-[#A987D0] rounded-2xl p-4">
              <p className="text-[#A987D0] text-lg mb-2">Your Score</p>
              <p className="text-2xl text-[#A987D0]">
                {userSequence.length}/{GRID_SIZE}
              </p>
              <p className="text-sm text-[#A987D0] opacity-75 mt-1">
                {Math.round((userSequence.length / GRID_SIZE) * 100)}% accuracy
              </p>
            </div>
          </div>
        )}
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