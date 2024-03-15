const pool = require("./db.js");

async function calculateStats() {
  const client = await pool.connect();
  let data;

  try {
    const res = await client.query('SELECT * FROM question_stats');
    data = res.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    client.release();
  }

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
