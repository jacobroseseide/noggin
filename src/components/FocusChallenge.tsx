import { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface FocusChallengeProps {
  onNext: () => void;
}

// Move constants outside component to prevent recreation on every render
const SHAPES = ["●", "■", "▲", "♦", "⬡", "★", "♥", "⬟"];
const COLORS = ["#A987D0"];
const GRID_SIZE = 15; // 3x5 grid

// Helper function to create grid data
const createGridData = () => {
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
    color: COLORS[0], // All shapes same color
    isUnique: index === uniqueShapeIndex
  }));

  return { grid: gridData, uniqueIndex: uniqueShapeIndex };
};

export default function FocusChallenge({ onNext }: FocusChallengeProps) {
  const [timeLeft, setTimeLeft] = useState(25); // 25 seconds
  const [gameActive, setGameActive] = useState(true);
  const [found, setFound] = useState(false);

  // Generate initial grid with pairs and one unique shape
  const { grid, uniqueIndex } = useMemo(createGridData, []); // Empty dependency array - only generate once

  // Handle shape click
  const handleShapeClick = (index: number) => {
    if (!gameActive || found) return;
    
    if (index === uniqueIndex) {
      setFound(true);
      setGameActive(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && gameActive && !found) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive, found]);

  const progressPercentage = ((25 - timeLeft) / 25) * 100;

  const getShapeComponent = (item: { shape: string; color: string; isUnique: boolean }, index: number) => {
    const baseClasses = "w-12 h-12 cursor-pointer transition-all duration-200 flex items-center justify-center rounded-2xl border-2";
    const normalClasses = "bg-[#FDF9F3] border-[#A987D0] hover:scale-105";
    const foundClasses = found && item.isUnique ? "bg-[#A987D0] border-[#A987D0] text-[#FDF9F3] scale-110 shadow-lg" : "";
    
    const classes = `${baseClasses} ${normalClasses} ${foundClasses}`;

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

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FDF9F3]"
      style={{ fontFamily: "Anonymous Pro, monospace" }}
    >
      {/* Header with progress bar and step indicator */}
      <header className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[#A987D0] text-lg">Focus Challenge</div>
          <div className="text-[#A987D0] text-sm opacity-75">Step 2 of 4</div>
        </div>
        <div className="space-y-2 bg-[rgba(0,0,0,0)]">
          <div className="flex justify-between text-sm text-[#A987D0] opacity-75">
            <span>Time Remaining</span>
            <span>{timeLeft}s</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2 [&>div]:bg-[#EC8BD0]" 
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Instructions */}
        <div className="text-center mb-8">
          <h1 className="text-2xl text-[#A987D0] mb-2">
            Find the shape that appears only once!
          </h1>
          {found && (
            <p className="text-[#A987D0] opacity-75">Great job! You found the unique shape!</p>
          )}
          {!found && !gameActive && (
            <p className="text-[#A987D0] opacity-75">Time's up! The unique shape was highlighted.</p>
          )}
        </div>

        {/* Game grid */}
        <div className="grid grid-cols-5 gap-3 mb-8 max-w-lg">
          {grid.map((item, index) => getShapeComponent(item, index))}
        </div>

        {/* Next button */}
        <Button
          className={`px-8 py-3 rounded-full border-2 transition-all ${
            gameActive && !found
              ? "bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] opacity-50 cursor-not-allowed"
              : "bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
          }`}
          onClick={onNext}
          disabled={gameActive && !found}
        >
          Next → Logic Challenge
        </Button>

        {/* Success message */}
        {found && (
          <div className="mt-4 text-center">
            <p className="text-[#A987D0] opacity-75">
              Excellent focus! You found it with {timeLeft} seconds remaining.
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