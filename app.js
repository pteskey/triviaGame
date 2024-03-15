const db = require("./public/js/db");
const express = require("express");
const bodyParser = require("body-parser");
const calculateStats = require("./public/js/calcdata");
const app = express();
const PORT = 3000;
app.set("view engine", "ejs");

app.get("/stats", async (req, res) => {
  try {
    let stats = await calculateStats();
    if (!stats || Object.keys(stats).length === 0) {
      console.error("Stats is empty");
    }
    res.render("stats", { stats: stats });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while reading the data.");
  }
});

app.use(bodyParser.json());

// Serve static files
app.use(express.static("public"));

// Endpoint to get all data
app.get("/api/data", async (req, res) => {
  try {
    const data = await getData();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/data", async (req, res) => {
  try {
    const questions = req.body.questions;

    if (!Array.isArray(questions)) {
      res.status(400).json({ error: "Missing or invalid questions" });
      return;
    }

    for (const question of questions) {
      await saveData(question);
    }

    res.json({ success: true, message: "Data added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getData() {
  try {
    return await db.any("SELECT * FROM data");
  } catch (error) {
    console.error("Error reading from database:", error);
    return []; // Return an empty array if there was an error
  }
}

async function saveData(question) {
  try {
    await db.none(
      "INSERT INTO question_stats(correct_answer, category, difficulty) VALUES($1, $2, $3)",
      [question.correctlyAnswered, question.category, question.difficulty]
    );
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
