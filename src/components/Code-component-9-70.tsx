import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface FocusChallengeProps {
  onNext: () => void;
}

export default function FocusChallenge({ onNext }: FocusChallengeProps) {
  const [timeLeft, setTimeLeft] = useState(25); // 25 seconds
  const [gameActive, setGameActive] = useState(true);
  const [found, setFound] = useState(false);
  const [oddOneIndex, setOddOneIndex] = useState<number>(0);

  const gridSize = 20; // 4x5 grid for 20 shapes
  const shapes = ["●", "■", "▲"];
  const colors = ["#A987D0", "#7C6BA0", "#9B59B6"];

  // Generate grid with one odd shape
  const generateGrid = useCallback(() => {
    const normalShapeIndex = Math.floor(Math.random() * shapes.length);
    const normalColorIndex = 0; // Always use purple as normal
    const normalShape = shapes[normalShapeIndex];
    const normalColor = colors[normalColorIndex];

    // Choose what makes the odd one different (shape or color)
    const differenceType = Math.random() > 0.5 ? "shape" : "color";
    let oddShape = normalShape;
    let oddColor = normalColor;

    if (differenceType === "shape") {
      // Different shape, same color
      const availableShapes = shapes.filter((_, index) => index !== normalShapeIndex);
      oddShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    } else {
      // Different color, same shape
      const availableColors = colors.filter((_, index) => index !== normalColorIndex);
      oddColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    }

    const oddIndex = Math.floor(Math.random() * gridSize);
    setOddOneIndex(oddIndex);

    return Array.from({ length: gridSize }, (_, index) => ({
      shape: index === oddIndex ? oddShape : normalShape,
      color: index === oddIndex ? oddColor : normalColor,
      isOdd: index === oddIndex
    }));
  }, [gridSize, shapes, colors]);

  const [grid, setGrid] = useState(() => generateGrid());

  // Handle shape click
  const handleShapeClick = (index: number) => {
    if (!gameActive || found) return;
    
    if (index === oddOneIndex) {
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

  // Generate new grid on component mount
  useEffect(() => {
    setGrid(generateGrid());
  }, [generateGrid]);

  const progressPercentage = ((25 - timeLeft) / 25) * 100;

  const getShapeComponent = (item: { shape: string; color: string; isOdd: boolean }, index: number) => {
    const baseClasses = "w-12 h-12 cursor-pointer transition-all duration-200 flex items-center justify-center rounded-2xl border-2";
    const normalClasses = "bg-[#FDF9F3] border-[#A987D0] hover:scale-105";
    const foundClasses = found && item.isOdd ? "bg-[#A987D0] border-[#A987D0] text-[#FDF9F3] scale-110 shadow-lg" : "";
    
    const classes = `${baseClasses} ${normalClasses} ${foundClasses}`;

    return (
      <div
        key={index}
        className={classes}
        onClick={() => handleShapeClick(index)}
      >
        <span 
          className="text-xl transition-colors"
          style={{ color: found && item.isOdd ? "#FDF9F3" : item.color }}
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
            One shape is different — find it before time runs out!
          </h1>
          {found && (
            <p className="text-[#A987D0] opacity-75">Great job! You found the different shape!</p>
          )}
          {!found && !gameActive && (
            <p className="text-[#A987D0] opacity-75">Time's up! The different shape was highlighted.</p>
          )}
        </div>

        {/* Game grid */}
        <div className="grid grid-cols-4 gap-3 mb-8 max-w-md">
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