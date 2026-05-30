enum WordKind {
  Noun = 'noun',
  Verb = 'verb',
  Adj = 'adj',
  Adv = 'adv',
}

enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
  Veryhard = 'Veryhard',
}

const DifficultyLabel = {
  Easy: 'IELTS 3.0 score',
  Medium: 'IELTS 5.0 score',
  Hard: 'IELTS 7.0 score',
  Veryhard: 'IELTS 8.0 score',
} as const;

const DifficultyNumber = {
  Easy: 2,
  Medium: 3,
  Hard: 4,
  Veryhard: 5,
} as const;

export { WordKind, Difficulty, DifficultyNumber, DifficultyLabel };
