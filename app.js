const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const fsp = require("fs").promises;
const calculateStats = require('./public/js/calcdata');

const app = express();
const PORT = 3000;
app.set("view engine", "ejs");

app.get('/stats', async (req, res) => {
  try {
    let rawData = await fsp.readFile('./data/data.json');
    let jsonData = JSON.parse(rawData);
    let data = jsonData.flatMap(obj => obj.questions);
    let stats = calculateStats(data);
    // Render the dashboard view and pass the stats
    res.render('stats', { stats: stats });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while reading the data.');
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

// Endpoint to add data
app.post("/api/data", async (req, res) => {
  try {
    const newData = req.body;

    const data = await getData();
    data.push(newData);

    await saveData(data);

    res.json({ success: true, message: "Data added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Helper functions to read and write data
async function getData() {
  try {
    const rawData = fs.readFileSync("./data/data.json", "utf8");
    if (rawData.trim() === "") {
      return []; // Return an empty array if the file is empty
    }
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading or parsing data.json:", error);
    return []; // Return an empty array if there was an error
  }
}

async function saveData(data) {
  try {
    await fsp.writeFile("./data/data.json", JSON.stringify(data));
  } catch (error) {
    console.error("Error writing data.json:", error);
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
