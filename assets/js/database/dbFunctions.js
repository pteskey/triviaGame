// Database functions and JSON validation
const Ajv = require("ajv");
const ajv = new Ajv();
const fs = require("fs");

function readDb(dbName = "db.json") {
  // read JSON object from file
  const data = fs.readFileSync(dbName, "utf8");
  return JSON.parse(data);
}

//Write to Database function
function writeDb(jsonData) {
  // Validate the JSON data against the schema
  const isValid = ajv.validate(schema, jsonData);

  if (isValid) {
    // Proceed with writing the data to the database
    fs.writeFileSync("./database/db.json", JSON.stringify(jsonData, null, 2));
    console.log("Data written to the database successfully.");
  } else {
    console.error("Validation error:", ajv.errors);
    // Handle the case where the data does not conform to the schema
  }
}

module.exports = { readDb, writeDb };
