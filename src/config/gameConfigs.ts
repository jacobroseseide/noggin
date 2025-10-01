import { GameConfig, GameCategory } from '../types/gameConfig';

export const GAME_CATEGORIES: GameCategory[] = [
  {
    id: 'speed',
    name: 'Speed',
    description: 'Test your reaction time and quick thinking',
    icon: '⚡',
    color: '#EC8BD0'
  },
  {
    id: 'focus',
    name: 'Focus',
    description: 'Challenge your attention and concentration',
    icon: '🎯',
    color: '#A987D0'
  },
  {
    id: 'logic',
    name: 'Logic',
    description: 'Exercise your reasoning and problem-solving skills',
    icon: '🧩',
    color: '#A987D0'
  },
  {
    id: 'memory',
    name: 'Memory',
    description: 'Train your recall and retention abilities',
    icon: '🧠',
    color: '#A987D0'
  }
];

export const GAME_CONFIGS: GameConfig[] = [
  // Speed Games
  {
    id: 'speed-shape-tap',
    name: 'Shape Tapping',
    description: 'Tap the highlighted shape as quickly as you can!',
    difficulty: 'easy',
    timeLimit: 25,
    rules: [
      'You\'ll see a 3x3 grid of shapes',
      'Tap the highlighted shape as quickly as you can!',
      'You have 25 seconds to score as many points as possible'
    ],
    category: GAME_CATEGORIES[0]
  },
  {
    id: 'speed-color-match',
    name: 'Color Matching',
    description: 'Tap shapes that match the target color',
    difficulty: 'medium',
    timeLimit: 30,
    rules: [
      'A target color will be shown',
      'Tap all shapes matching that color',
      'You have 30 seconds to score points'
    ],
    category: GAME_CATEGORIES[0]
  },
  {
    id: 'speed-reaction',
    name: 'Reaction Time',
    description: 'Tap when the screen changes color',
    difficulty: 'hard',
    timeLimit: 20,
    rules: [
      'Wait for the screen to change color',
      'Tap as quickly as possible when it changes',
      'You have 20 seconds to get the best reaction time'
    ],
    category: GAME_CATEGORIES[0]
  },

  // Focus Games
  {
    id: 'focus-unique-shape',
    name: 'Unique Shape',
    description: 'Find the shape that appears only once!',
    difficulty: 'easy',
    timeLimit: 25,
    rules: [
      'You\'ll see a grid of shapes where most appear in pairs',
      'Find the one shape that appears only once!',
      'You have 25 seconds to find the unique shape'
    ],
    category: GAME_CATEGORIES[1]
  },
  {
    id: 'focus-color-find',
    name: 'Color Focus',
    description: 'Find shapes of different colors',
    difficulty: 'medium',
    timeLimit: 30,
    rules: [
      'Look for shapes that are different colors',
      'Tap the differently colored shapes',
      'You have 30 seconds to find them all'
    ],
    category: GAME_CATEGORIES[1]
  },
  {
    id: 'focus-stroop',
    name: 'Stroop Test',
    description: 'Say the color of the word, not the word itself',
    difficulty: 'hard',
    timeLimit: 35,
    rules: [
      'Words will appear in different colors',
      'Say the color of the word, not what the word says',
      'You have 35 seconds to complete as many as possible'
    ],
    category: GAME_CATEGORIES[1]
  },

  // Logic Games
  {
    id: 'logic-word-problem',
    name: 'Word Problems',
    description: 'Solve logic puzzles and word problems',
    difficulty: 'easy',
    timeLimit: 30,
    rules: [
      'You\'ll be presented with a logic puzzle',
      'Read the question carefully and select the correct answer',
      'You have 30 seconds to solve the puzzle'
    ],
    category: GAME_CATEGORIES[2]
  },
  {
    id: 'logic-pattern',
    name: 'Pattern Recognition',
    description: 'Complete the sequence or pattern',
    difficulty: 'medium',
    timeLimit: 40,
    rules: [
      'Look at the pattern or sequence',
      'Identify what comes next',
      'You have 40 seconds to solve it'
    ],
    category: GAME_CATEGORIES[2]
  },
  {
    id: 'logic-spatial',
    name: 'Spatial Reasoning',
    description: 'Solve spatial and geometric puzzles',
    difficulty: 'hard',
    timeLimit: 45,
    rules: [
      'Visualize and manipulate shapes in your mind',
      'Answer questions about spatial relationships',
      'You have 45 seconds to solve the puzzle'
    ],
    category: GAME_CATEGORIES[2]
  },

  // Memory Games
  {
    id: 'memory-sequence',
    name: 'Sequence Memory',
    description: 'Remember the order of symbols',
    difficulty: 'easy',
    timeLimit: 5,
    rules: [
      'You\'ll see a sequence of symbols for 5 seconds',
      'Memorize the order of the symbols',
      'Then recreate the sequence by clicking them in order'
    ],
    category: GAME_CATEGORIES[3]
  },
  {
    id: 'memory-spatial',
    name: 'Spatial Memory',
    description: 'Remember positions on a grid',
    difficulty: 'medium',
    timeLimit: 8,
    rules: [
      'Memorize the positions of highlighted squares',
      'Recreate the pattern after it disappears',
      'You have 8 seconds to memorize'
    ],
    category: GAME_CATEGORIES[3]
  },
  {
    id: 'memory-number',
    name: 'Number Memory',
    description: 'Remember increasing digit sequences',
    difficulty: 'hard',
    timeLimit: 10,
    rules: [
      'Numbers will appear one by one',
      'Remember the entire sequence',
      'You have 10 seconds to memorize'
    ],
    category: GAME_CATEGORIES[3]
  }
];

// Helper functions
export const getGamesByCategory = (categoryId: string): GameConfig[] => {
  return GAME_CONFIGS.filter(game => game.category.id === categoryId);
};

export const getGameById = (gameId: string): GameConfig | undefined => {
  return GAME_CONFIGS.find(game => game.id === gameId);
};

export const getGamesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): GameConfig[] => {
  return GAME_CONFIGS.filter(game => game.difficulty === difficulty);
};



