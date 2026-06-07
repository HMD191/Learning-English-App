function getPromptEvaluateWordDifficulty(word: string): string {
  return `Evaluate the difficulty level of the word "${word.toLowerCase()}".
      Return ONLY a single integer from 1 to 5:
      1 = very easy (approximately IELTS 3.0-4.0 vocabulary)
      2 = easy (approximately IELTS 5.0 vocabulary)
      3 = intermediate (approximately IELTS 6.0 vocabulary)
      4 = advanced (approximately IELTS 7.0 vocabulary)
      5 = very advanced (approximately IELTS 8.0+ vocabulary)

      Base your evaluation primarily on:
      - How common the word is in everyday English.
      - How frequently native speakers use it in daily conversations.
      - How likely is an IELTS learner to know the word
      - Complexity of spelling and word length.

      More common and useful words should receive lower scores.
      Return only the integer and nothing else.
    `;
}

function getPromptMeaningChoice(word: string, difficulty: string): string {
  return `Generate a sentence with a blank ("___" present for blank) and 4 random answer options, where the true answer to fill in the blank must be exactly the word "${word.toLowerCase()}". 
    The sentence should be suitable for ${difficulty} level.
    Generate an explanation in vietnamese for correct answer and why each of the other three options is incorrect.
    Follow the format below strictly:
    Sentence: <sentence here>
    a: <option 1>
    b: <option 2>
    c: <option 3>
    d: <option 4>
    RightAnswer: <correct option letter> (e.g., a, b, c, or d)
    Explanation: <explanation for the correct answer in vietnamese>
    `;
}

function getPromptWordKindChoice(word: string, difficulty: string): string {
  return `Generate a sentence that includes a blank ("___") to be filled. Generate four random answer options to fill in the blank corresponding to 4 different kinds: a noun, a verb, an adjective, and an adverb which based on the word "${word.toLowerCase()}" (include original word).
    The options must be different from each other in spelling and must not be labeled with their word kinds.
    If cannot be generated enough valid words from the word "${word.toLowerCase()}", use unrelated words that fit the required parts of speech.
    The sentence should be suitable for ${difficulty} level. 
    Generate an explanation in Vietnamese for the correct answer and why each of the other three options is incorrect.
    Follow the format below strictly:
    Sentence: <sentence here>
    a: <option 1>
    b: <option 2>
    c: <option 3>
    d: <option 4>
    RightAnswer: <correct option letter> (e.g., a, b, c, or d)
    Explanation: <explanation for the correct answer in vietnamese>
    `;
}

export {
  getPromptEvaluateWordDifficulty,
  getPromptMeaningChoice,
  getPromptWordKindChoice,
};
