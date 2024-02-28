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

// Functions for question
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
  console.log(categorydata);
  return categorydata;
}

async function populateCategories() {
  const data = await fetchCategories();
  const selectElement = document.getElementById("categories");

  // Loop through the optionsData and append options to the select element
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

// Fetch for question data
async function fetchQuestions() {
  const select = document.getElementById("categories");
  let apiURL = `https://opentdb.com/api.php?amount=${questionAmount}&category=${select.value}&difficulty=${difficulty}&type=multiple`;
  const response = await fetch(apiURL);
  const questions = await response.json();
  console.log(questions);
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
      
      <div class="triviaContainer">
        <div class="questionBox">
          <div class="question">
            ${questions.results[id].question}
          </div>
        </div>
        <div class="answerBox">
          <button id="answerBtn" class="answerA" onclick="checkAns()">${answers[0]}</button>
          <button id="answerBtn" class="answerB" onclick="checkAns()">${answers[1]}</button>
          <button id="answerBtn" class="answerC" onclick="checkAns()">${answers[2]}</button>
          <button id="answerBtn" class="answerD" onclick="checkAns()">${answers[3]}</button>
        </div>
        <span id="score">0 / ${questionAmount}</span>
      </div>
      <span id="result"></span>
      `;
  app.innerHTML = html;

  checkAns = () => {
    const result = document.getElementById("result");
    const scoreresult = document.getElementById("score");

    if (
      document.activeElement.innerHTML === questions.results[id].correct_answer
    ) {
      document.activeElement.style.background = "#00FF73";
      result.innerHTML = "Correct!";
      score++;
      scoreresult.innerHTML = `${score} / ${questions.results.length}`;

      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      document.activeElement.style.background = "#FF6565";
      result.innerHTML = "Wrong!";
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    }
  };

  function nextQuestion() {
    id++;
    let html = "";
    const answers = questions.results[id].incorrect_answers.concat(
      questions.results[id].correct_answer
    );
    shuffle(answers);
    html += `
    <div class="triviaContainer">
      <div class="questionBox">
        <div class="question">
          ${questions.results[id].question}
        </div>
      </div>
      <div class="answerBox">
        <button id="answerBtn" class="answerA" onclick="checkAns()">${answers[0]}</button>
        <button id="answerBtn" class="answerB" onclick="checkAns()">${answers[1]}</button>
        <button id="answerBtn" class="answerC" onclick="checkAns()">${answers[2]}</button>
        <button id="answerBtn" class="answerD" onclick="checkAns()">${answers[3]}</button>
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
  }
}

populateCategories();
