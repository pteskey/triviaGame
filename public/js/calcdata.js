const fs = require("fs");

let rawData = fs.readFileSync("data/data.json");
let jsonData = JSON.parse(rawData);

// Flatten the array of questions
let data = jsonData.flatMap((obj) => obj.questions);

function calculateStats(data) {
  let totalQuestions = data.length;
  let correctAnswers = data.filter((q) => q.correctlyAnswered).length;

  let categories = [...new Set(data.map((q) => q.category))];
  let difficulties = ["easy", "medium", "hard"];

  let accuracyByCategory = categories.map((category) => {
    let questionsInCategory = data.filter((q) => q.category === category);
    let correctInCategory = questionsInCategory.filter(
      (q) => q.correctlyAnswered
    ).length;
    return {
      category,
      accuracy: correctInCategory / questionsInCategory.length,
    };
  });

  let accuracyByDifficulty = difficulties.map((difficulty) => {
    let questionsInDifficulty = data.filter((q) => q.difficulty === difficulty);
    let correctInDifficulty = questionsInDifficulty.filter(
      (q) => q.correctlyAnswered
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

let stats = calculateStats(data);

module.exports = calculateStats;
