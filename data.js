const fs = require('fs');
let rawdata = fs.readFileSync('data.json');
let data = JSON.parse(rawdata);


// Read the file
fs.readFile('data.json', 'utf8', (err, fileContents) => {
  if (err) {
    console.error(err);
    return;
  }

  try {
    // Parse the file contents as JSON
    const data = JSON.parse(fileContents);
  } catch(err) {
    console.error(err);
  }
});

// Initialize the count object
let count = {};

// Iterate over the questions
data.forEach(item => {
  item.questions.forEach(question => {
    // Initialize the category in the count object if it doesn't exist
    if (!count[question.category]) {
      count[question.category] = {
        correct: 0,
        total: 0
      };
    }

    // Increment the total count for the category
    count[question.category].total++;

    // Increment the correct count for the category if the question was answered correctly
    if (question.correctlyAnswered) {
      count[question.category].correct++;
    }
  });
});

module.exports = {data, count};