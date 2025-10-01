import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { GAME_CATEGORIES, GAME_CONFIGS, getGamesByCategory } from "../config/gameConfigs";
import { GameConfig } from "../types/gameConfig";

interface GameSelectorProps {
  onGameSelect: (gameConfig: GameConfig) => void;
  onBack?: () => void;
}

export default function GameSelector({ onGameSelect, onBack }: GameSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else if (onBack) {
      onBack();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedCategory) {
    const games = getGamesByCategory(selectedCategory);
    const category = GAME_CATEGORIES.find(cat => cat.id === selectedCategory);

    return (
      <div
        className="min-h-screen flex flex-col bg-[#FDF9F3]"
        style={{ fontFamily: "Anonymous Pro, monospace" }}
      >
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={handleBack}
              className="px-4 py-2 rounded-full border-2 bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
            >
              ← Back
            </Button>
            <div className="text-[#A987D0] text-lg">
              {category?.name} Games
            </div>
          </div>
        </header>

        {/* Games Grid */}
        <main className="flex-1 px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <Card
                  key={game.id}
                  className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 border-[#A987D0] bg-[#FDF9F3]"
                  onClick={() => onGameSelect(game)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[#A987D0] text-xl">
                        {game.name}
                      </CardTitle>
                      <Badge className={getDifficultyColor(game.difficulty)}>
                        {game.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="text-[#A987D0] opacity-75">
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-[#A987D0] opacity-75">
                        Time Limit: {game.timeLimit}s
                      </div>
                      <div className="text-sm text-[#A987D0] opacity-75">
                        Rules:
                      </div>
                      <ul className="text-xs text-[#A987D0] opacity-60 space-y-1">
                        {game.rules.slice(0, 2).map((rule, index) => (
                          <li key={index}>• {rule}</li>
                        ))}
                        {game.rules.length > 2 && (
                          <li>• ...and more</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-[#FDF9F3]"
      style={{ fontFamily: "Anonymous Pro, monospace" }}
    >
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-[#A987D0] text-2xl font-bold">
            Choose Your Challenge
          </div>
          {onBack && (
            <Button
              onClick={onBack}
              className="px-4 py-2 rounded-full border-2 bg-[#FDF9F3] text-[#A987D0] border-[#A987D0] hover:bg-[#A987D0] hover:text-[#FDF9F3]"
            >
              ← Back to Home
            </Button>
          )}
        </div>
      </header>

      {/* Categories Grid */}
      <main className="flex-1 px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GAME_CATEGORIES.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 border-[#A987D0] bg-[#FDF9F3]"
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <CardTitle className="text-[#A987D0] text-xl">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-[#A987D0] opacity-75">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-sm text-[#A987D0] opacity-60">
                      {getGamesByCategory(category.id).length} games available
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

