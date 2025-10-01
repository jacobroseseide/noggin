import { useState } from "react";
import { Button } from "../ui/button";
import { GameConfig, GameState, GameActions } from "../../types/gameConfig";

interface LogicGameProps {
  config: GameConfig;
  onNext?: () => void;
  gameState: GameState;
  gameActions: GameActions;
}

// Game-specific puzzle data
const PUZZLES = {
  'logic-word-problem': {
    question: "If two cats can catch two mice in two minutes, how many cats are needed to catch 100 mice in 100 minutes?",
    options: [
      "2 cats",
      "50 cats", 
      "100 cats",
      "200 cats"
    ],
    correct: "2 cats"
  },
  'logic-pattern': {
    question: "What comes next in this sequence: 2, 4, 8, 16, ?",
    options: [
      "24",
      "32", 
      "20",
      "18"
    ],
    correct: "32"
  },
  'logic-spatial': {
    question: "If you fold a square piece of paper in half twice and cut a small triangle from the corner, how many holes will you have when you unfold it?",
    options: [
      "1 hole",
      "2 holes", 
      "4 holes",
      "8 holes"
    ],
    correct: "4 holes"
  }
};

export default function LogicGame({ config, onNext, gameState, gameActions }: LogicGameProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  const puzzle = PUZZLES[config.id as keyof typeof PUZZLES] || PUZZLES['logic-word-problem'];

  const handleAnswerSelect = (answer: string) => {
    if (!gameState.gameActive) return;
    setSelectedAnswer(answer);
    
    // End game immediately when answer is selected
    gameActions.endGame();
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
          {/* Game Instructions */}
          <div className="text-center mb-8">
            <h1 className="text-2xl text-[#A987D0] mb-6">
              {config.name}
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
                } ${!gameState.gameActive ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => handleAnswerSelect(option)}
                disabled={!gameState.gameActive}
              >
                {option}
              </Button>
            ))}
          </div>

          {/* Next button - only show after game is complete */}
          {!gameState.showInstructions && (
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
          {!gameState.showInstructions && selectedAnswer && !gameState.gameActive && (
            <div className="mt-4 text-center">
              <p className="text-[#A987D0] opacity-75">
                {selectedAnswer === puzzle.correct 
                  ? "Excellent reasoning! You got it right." 
                  : `Nice try! The correct answer was "${puzzle.correct}".`}
              </p>
            </div>
          )}

          {!gameState.showInstructions && !selectedAnswer && !gameState.gameActive && (
            <div className="mt-4 text-center">
              <p className="text-[#A987D0] opacity-75">
                Time's up! The correct answer was "{puzzle.correct}".
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}