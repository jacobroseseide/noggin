import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface LogicChallengeProps {
  onNext: () => void;
}

export default function LogicChallenge({ onNext }: LogicChallengeProps) {
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const puzzle = {
    question: "If two cats can catch two mice in two minutes, how many cats are needed to catch 100 mice in 100 minutes?",
    options: [
      "2 cats",
      "50 cats", 
      "100 cats",
      "200 cats"
    ],
    correct: "2 cats"
  };

  // Handle start button click
  const handleStartGame = () => {
    setShowInstructions(false);
    setGameActive(true);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (!gameActive) return;
    setSelectedAnswer(answer);
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

  const progressPercentage = gameActive ? ((30 - timeLeft) / 30) * 100 : 0;

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FDF9F3]"
      style={{ fontFamily: "Anonymous Pro, monospace" }}
    >
      {/* Header with progress bar and step indicator */}
      <header className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[#A987D0] text-lg">Logic Challenge</div>
          <div className="text-[#A987D0] text-sm opacity-75">Step 3 of 4</div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-[#A987D0] opacity-75">
            <span>{gameActive ? "Time Remaining" : "Ready to start"}</span>
            <span>{gameActive ? `${timeLeft}s` : "Click Start"}</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2 [&>div]:bg-[#EC8BD0]" 
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {showInstructions ? (
          /* Instructions Phase */
          <div className="text-center max-w-2xl">
            <h1 className="text-3xl text-[#A987D0] mb-6">
              Logic Challenge
            </h1>
            <div className="space-y-4 text-lg text-[#A987D0] opacity-90">
              <p>You'll be presented with a logic puzzle</p>
              <p>Read the question carefully and select the correct answer</p>
              <p>You have 30 seconds to solve the puzzle</p>
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
            {/* Instructions */}
            <div className="text-center mb-8">
              <h1 className="text-2xl text-[#A987D0] mb-6">
                Logic Challenge
              </h1>
            </div>

            {/* Puzzle Question */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-[#FDF9F3] border-2 border-[#A987D0] rounded-2xl p-6 text-center">
                <p className="text-[#A987D0] text-lg leading-relaxed">
                  {puzzle.question}
                </p>
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              {puzzle.options.map((option, index) => (
                <Button
                  key={index}
                  className={`px-6 py-4 rounded-full border-2 transition-all text-base ${
                    selectedAnswer === option
                      ? "bg-[#A987D0] text-[#FDF9F3] border-[#A987D0]"
                      : "bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
                  } ${!gameActive ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={!gameActive}
                >
                  {option}
                </Button>
              ))}
            </div>
          </>
        )}

        {/* Next button - only show after game is complete */}
        {!showInstructions && (
          <Button
            className={`px-8 py-3 rounded-full border-2 transition-all ${
              !selectedAnswer
                ? "bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] opacity-50 cursor-not-allowed"
                : "bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
            }`}
            onClick={onNext}
            disabled={!selectedAnswer}
          >
            Next → Memory Challenge
          </Button>
        )}

        {/* Result message */}
        {!showInstructions && selectedAnswer && !gameActive && (
          <div className="mt-4 text-center">
            <p className="text-[#A987D0] opacity-75">
              {selectedAnswer === puzzle.correct 
                ? "Excellent reasoning! You got it right." 
                : `Nice try! The correct answer was "${puzzle.correct}".`}
            </p>
          </div>
        )}

        {!showInstructions && !selectedAnswer && !gameActive && (
          <div className="mt-4 text-center">
            <p className="text-[#A987D0] opacity-75">
              Time's up! The correct answer was "{puzzle.correct}".
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