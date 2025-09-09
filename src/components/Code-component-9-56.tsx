import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface SpeedChallengeProps {
  onNext: () => void;
}

export default function SpeedChallenge({ onNext }: SpeedChallengeProps) {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(25); // 25 seconds
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);

  const shapes = ["circle", "square", "triangle", "diamond", "hexagon", "star", "heart", "pentagon", "oval"];
  const gridSize = 9; // 3x3 grid

  // Generate random highlighted shape
  const generateNewHighlight = useCallback(() => {
    if (gameActive) {
      setHighlightedIndex(Math.floor(Math.random() * gridSize));
    }
  }, [gameActive, gridSize]);

  // Handle shape click
  const handleShapeClick = (index: number) => {
    if (!gameActive) return;
    
    if (index === highlightedIndex) {
      setScore(prev => prev + 1);
      generateNewHighlight();
    }
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && gameActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive]);

  // Auto-generate new highlights every 1.5 seconds
  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(generateNewHighlight, 1500);
      return () => clearInterval(interval);
    }
  }, [generateNewHighlight, gameActive]);

  // Initial highlight
  useEffect(() => {
    generateNewHighlight();
  }, [generateNewHighlight]);

  const progressPercentage = ((25 - timeLeft) / 25) * 100;

  const getShapeComponent = (shapeType: string, isHighlighted: boolean, index: number) => {
    const baseClasses = "w-16 h-16 cursor-pointer transition-all duration-200 flex items-center justify-center rounded-2xl border-2";
    const normalClasses = "bg-[#FDF9F3] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]";
    const highlightedClasses = "bg-[#A987D0] border-[#A987D0] text-[#FDF9F3] scale-110 shadow-lg";
    
    const classes = `${baseClasses} ${isHighlighted ? highlightedClasses : normalClasses}`;

    const shapeEmojis: { [key: string]: string } = {
      circle: "●",
      square: "■",
      triangle: "▲",
      diamond: "♦",
      hexagon: "⬡",
      star: "★",
      heart: "♥",
      pentagon: "⬟",
      oval: "⬭"
    };

    return (
      <div
        key={index}
        className={classes}
        onClick={() => handleShapeClick(index)}
      >
        <span className="text-2xl">{shapeEmojis[shapeType]}</span>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FDF9F3]"
      style={{ fontFamily: "Anonymous Pro, monospace" }}
    >
      {/* Header with progress bar and step indicator */}
      <header className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[#A987D0] text-lg">Speed Challenge</div>
          <div className="text-[#A987D0] text-sm opacity-75">Step 1 of 4</div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-[#A987D0] opacity-75">
            <span>Time Remaining</span>
            <span>{timeLeft}s</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Instructions */}
        <div className="text-center mb-8">
          <h1 className="text-2xl text-[#A987D0] mb-2">
            Tap the highlighted shape as quickly as you can!
          </h1>
          <p className="text-[#A987D0] opacity-75">Score: {score}</p>
        </div>

        {/* Game grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {Array.from({ length: gridSize }, (_, index) => {
            const shapeType = shapes[index % shapes.length];
            const isHighlighted = index === highlightedIndex && gameActive;
            return getShapeComponent(shapeType, isHighlighted, index);
          })}
        </div>

        {/* Next button */}
        <Button
          className={`px-8 py-3 rounded-full border-2 transition-all ${
            gameActive
              ? "bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] opacity-50 cursor-not-allowed"
              : "bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
          }`}
          onClick={onNext}
          disabled={gameActive}
        >
          Next → Focus Challenge
        </Button>

        {/* Game over message */}
        {!gameActive && (
          <div className="mt-4 text-center">
            <p className="text-[#A987D0] opacity-75">
              Great job! You scored {score} points in 25 seconds.
            </p>
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