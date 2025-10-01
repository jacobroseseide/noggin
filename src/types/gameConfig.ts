export interface GameConfig {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  rules: string[];
  category: GameCategory;
}

export interface GameCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface GameResult {
  gameId: string;
  score: number;
  timeSpent: number;
  completed: boolean;
  accuracy?: number;
  details?: Record<string, any>;
}

export interface GameState {
  phase: 'instructions' | 'playing' | 'complete';
  timeLeft: number;
  score: number;
  gameActive: boolean;
  showInstructions: boolean;
}

export interface GameProps {
  config: GameConfig;
  onComplete: (result: GameResult) => void;
  onNext?: () => void;
}

export interface GameActions {
  startGame: () => void;
  endGame: () => void;
  updateScore: (newScore: number) => void;
  setGameActive: (active: boolean) => void;
  setShowInstructions: (show: boolean) => void;
}


