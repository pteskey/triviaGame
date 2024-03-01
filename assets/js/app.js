let difficulty = "easy";
let questionAmount = 10;
const categories = "https://opentdb.com/api_category.php";

// Functions for difficulty select
function selectEasy() {
  return (difficulty = "easy");
}
function selectMed() {
  return (difficulty = "medium");
}
function selectHard() {
  return (difficulty = "hard");
}

// Functions for amount of questions
function amount10() {
  return (questionAmount = 10);
}
function amount15() {
  return (questionAmount = 15);
}
function amount20() {
  return (questionAmount = 20);
}

async function fetchCategories() {
  const response = await fetch(categories);
  const categorydata = await response.json();
  return categorydata;
}

async function populateCategories() {
  const data = await fetchCategories();
  const selectElement = document.getElementById("categories");

  // Loop through the categoryData and append options to the select element
  for (let i = 0; i < data.trivia_categories.length; i++) {
    const option = document.createElement("option");
    option.value = data.trivia_categories[i].id;
    option.text = data.trivia_categories[i].name;
    selectElement.appendChild(option);
  }
}

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
  const select = document.getElementById("categories");
  let apiURL = `https://opentdb.com/api.php?amount=${questionAmount}&category=${select.value}&difficulty=${difficulty}&type=multiple`;
  const response = await fetch(apiURL);
  const questions = await response.json();
  return questions;
}

async function startGame() {
  let app = document.querySelector("#app");
  let html = "";
  let id = 0;
  let score = 0;

  const questions = await fetchQuestions();
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
  <span id="score">${score} / ${questions.results.length}</span>
  </div>
<span id="result"></span>
      `;
  app.innerHTML = html;

  let answered = false;
  checkAnswer = (selectedChoice) => {
    // Get the correct answer (you might fetch this from your data)
    let correctAnswer = `${questions.results[id].correct_answer}`;
    const scoreresult = document.getElementById("score");
    if (answered) {
      return;
    }
    // Check if the selected answer is correct
    if (selectedChoice.innerText === correctAnswer) {
      // Correct answer: Change background color to green
      selectedChoice.style.backgroundColor = "#00FF73";
      score++;
      scoreresult.innerHTML = `${score} / ${questions.results.length}`;
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else {
      // Wrong answer: Change background color to red
      selectedChoice.style.backgroundColor = "#FF6565";
      setTimeout(() => {
        nextQuestion();
      }, 1000);
      // Optionally, you might want to highlight the correct answer as well
      var choices = document.getElementsByClassName("answer");
      for (var i = 0; i < choices.length; i++) {
        if (choices[i].innerText === correctAnswer) {
          choices[i].style.backgroundColor = "#00FF73";
        }
      }
    }
    answered = true;
  };

  nextQuestion = () => {
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
    <span id="score">${score} / ${questions.results.length}</span>
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
}

populateCategories();
