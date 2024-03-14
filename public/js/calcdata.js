const db = require("./db");

async function calculateStats() {
  let data = await db.any("SELECT * FROM question_stats");

  let totalQuestions = data.length;
  let correctAnswers = data.filter((q) => q.correct_answer).length;

  let categories = [...new Set(data.map((q) => q.category))];
  let difficulties = ["easy", "medium", "hard"];

  let accuracyByCategory = categories.map((category) => {
    let questionsInCategory = data.filter((q) => q.category === category);
    let correctInCategory = questionsInCategory.filter(
      (q) => q.correct_answer
    ).length;
    return {
      category,
      accuracy: correctInCategory / questionsInCategory.length,
    };
  });

  let accuracyByDifficulty = difficulties.map((difficulty) => {
    let questionsInDifficulty = data.filter((q) => q.difficulty === difficulty);
    let correctInDifficulty = questionsInDifficulty.filter(
      (q) => q.correct_answer
    ).length;
    return {
      difficulty,
      accuracy: correctInDifficulty / questionsInDifficulty.length,
    };
  });

  let questionsByCategory = categories.map((category) => {
    let questionsInCategory = data.filter(
      (q) => q.category === category
    ).length;
    return { category, questions: questionsInCategory };
  });

  let questionsByDifficulty = difficulties.map((difficulty) => {
    let questionsInDifficulty = data.filter(
      (q) => q.difficulty === difficulty
    ).length;
    return { difficulty, questions: questionsInDifficulty };
  });

  return {
    totalQuestions,
    correctAnswers,
    accuracyByCategory,
    accuracyByDifficulty,
    questionsByCategory,
    questionsByDifficulty,
  };
}

calculateStats();
module.exports = calculateStats;
