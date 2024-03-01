// Some default variables for game options
let difficulty = "easy";
let questionAmount = 10;
const categories = "https://opentdb.com/api_category.php";

// Functions for difficulty select
selectEasy = () => {
  return (difficulty = "easy");
};
selectMed = () => {
  return (difficulty = "medium");
};
selectHard = () => {
  return (difficulty = "hard");
};

// Functions for amount of questions
amount10 = () => {
  return (questionAmount = 10);
};
amount15 = () => {
  return (questionAmount = 15);
};
amount20 = () => {
  return (questionAmount = 20);
};

// Function to Shuffle an Array
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Fetch question data
async function fetchQuestions() {
  let apiURL = `https://opentdb.com/api.php?amount=${questionAmount}&difficulty=${difficulty}&type=multiple`;
  const response = await fetch(apiURL);
  const questions = await response.json();
  console.log(questions);
  return questions;
}

startGame = async () => {
// Send data to the server
async function sendDataToDatabase(data) {
  console.log('Sending data:', data); // Log the data before sending it
  const response = await fetch('http://localhost:3000/api/data', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  });

  if (!response.ok) {
      const errorData = await response.json(); // Try to parse the error response
      console.error('Error response:', errorData); // Log the error response
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

  //Default variables
  const app = document.querySelector("#app");
  let html = "";
  let id = 0;
  let score = 0;
  const questions = await fetchQuestions();
  const answers = questions.results[id].incorrect_answers.concat(
    questions.results[id].correct_answer
  );
  shuffle(answers);
  // Template for Trivia questions and answers
  html += `
  <div class="triviaContainer fade-in">
  <div class="questionBox">
    <div class="question">${questions.results[id].question}</div>
  </div>
  <div class="answerBox">
    <div class="answer" onclick="checkAnswer(this)">${answers[0]}</div>
    <div class="answer" onclick="checkAnswer(this)">${answers[1]}</div>
    <div class="answer" onclick="checkAnswer(this)">${answers[2]}</div>
    <div class="answer" onclick="checkAnswer(this)">${answers[3]}</div>
  </div>
  </div>
<span id="result"></span>
      `;
  app.innerHTML = html;

  let answered = false;
  checkAnswer = (selectedChoice) => {
    let correctAnswer = `${questions.results[id].correct_answer}`;
    if (answered) {
      return;
    }
    // Check if the selected answer is correct
    if (selectedChoice.innerText === correctAnswer) {
      selectedChoice.style.backgroundColor = "#00FF73";
      score++;
      const correctWrite = {
        questions: [
          {
            correctlyAnswered: true,
            category: `${questions.results[id].category}`,
            difficulty: `${questions.results[id].difficulty}`,
          },
        ],
      };
      sendDataToDatabase(correctWrite);
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else {
      selectedChoice.style.backgroundColor = "#FF6565";
      
      const incorrectWrite = {
        questions: [
          {
            correctlyAnswered: false,
            category: `${questions.results[id].category}`,
            difficulty: `${questions.results[id].difficulty}`,
          },
        ],
      };
      sendDataToDatabase(incorrectWrite);
      setTimeout(() => {
        nextQuestion();
      }, 1000);
      // Option to highlight correct answer if you chose wrong
      let choices = document.getElementsByClassName("answer");
      for (let i = 0; i < choices.length; i++) {
        if (choices[i].innerText === correctAnswer) {
          choices[i].style.backgroundColor = "#00FF73";
        }
      }
    }
    //Lockout anymore clicking
    answered = true;
  };

  nextQuestion = () => {
    //Reset answer status
    answered = false;
    id++;
    let html = "";
    const answers = questions.results[id].incorrect_answers.concat(
      questions.results[id].correct_answer
    );
    shuffle(answers);
    html += `
    <div class="triviaContainer fade-in">
    <div class="questionBox">
      <div class="question">${questions.results[id].question}</div>
    </div>
    <div class="answerBox">
      <div class="answer" onclick="checkAnswer(this)">${answers[0]}</div>
      <div class="answer" onclick="checkAnswer(this)">${answers[1]}</div>
      <div class="answer" onclick="checkAnswer(this)">${answers[2]}</div>
      <div class="answer" onclick="checkAnswer(this)">${answers[3]}</div>
    </div>
  </div>
  <span id="result"></span>
    `;
    app.innerHTML = html;
    console.log(id);

    if (id === questionAmount - 1) {
      app.innerHTML = `<h3>You got ${score} of ${questions.results.length} answers correct.</h3>
      <button id="retry" onclick="location.reload()">Try Again</button>
      `;
    }
  };
};

// Fetch and populate categories

// async function fetchCategories() {
//   const response = await fetch(categories);
//   const categorydata = await response.json();
//   return categorydata;
// }

// async function populateCategories() {
//   const data = await fetchCategories();
//   const selectElement = document.getElementById("categories");

//   // Loop through the categoryData and append options to the select element
//   for (let i = 0; i < data.trivia_categories.length; i++) {
//     const option = document.createElement("option");
//     option.value = data.trivia_categories[i].id;
//     option.text = data.trivia_categories[i].name;
//     selectElement.appendChild(option);
//   }
// }
// populateCategories();
