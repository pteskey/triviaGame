const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const fsp = require("fs").promises;
const getCount = require("./data.js");

const app = express();
const PORT = 3000;
app.set("view engine", "ejs");

app.get("/stats", (req, res) => {
  getCount((count) => {
    res.render("stats", { count: count });
  });
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
    const rawData = fs.readFileSync("data.json", "utf8");
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
    await fsp.writeFile("data.json", JSON.stringify(data));
  } catch (error) {
    console.error("Error writing data.json:", error);
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
