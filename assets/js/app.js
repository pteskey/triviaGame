// Functions for difficulty select
let apiURL = "https://opentdb.com/api.php?amount=10&type=multiple";

function selectEasy() {
  return (apiURL =
    "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple");
}
function selectMed() {
  return (apiURL =
    "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple");
}
function selectHard() {
  return (apiURL =
    "https://opentdb.com/api.php?amount=10&difficulty=hard&type=multiple");
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
  const response = await fetch(apiURL);
  const questions = await response.json();
  // console.log(questions);
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
      <span id="result"></span>
      <div class="triviaContainer">
        <div class="questionBox">
          <div class="question">
            ${questions.results[id].question}
          </div>
        </div>
        <div class="answerBox">
          <button class="answerA" onclick="checkAns()">${answers[0]}</button>
          <button class="answerB" onclick="checkAns()">${answers[1]}</button>
          <button class="answerC" onclick="checkAns()">${answers[2]}</button>
          <button class="answerD" onclick="checkAns()">${answers[3]}</button>
        </div>
        <span id="score">0 / 10</span>
      </div>
      `;
  app.innerHTML = html;

  checkAns = () => {
    result = document.getElementById("result");
    scoreresult = document.getElementById("score");
    if (
      document.activeElement.innerHTML === questions.results[id].correct_answer
    ) {
      document.activeElement.style.background = "green";
      result.innerHTML = "Correct!";
      score++;
      scoreresult.innerHTML = `${score} / ${questions.results.length}`;
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      document.activeElement.style.background = "red";
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
    <span id="result"></span>
    <div class="triviaContainer">
      <div class="questionBox">
        <div class="question">
          ${questions.results[id].question}
        </div>
      </div>
      <div class="answerBox">
        <button class="answerA" onclick="checkAns()">${answers[0]}</button>
        <button class="answerB" onclick="checkAns()">${answers[1]}</button>
        <button class="answerC" onclick="checkAns()">${answers[2]}</button>
        <button class="answerD" onclick="checkAns()">${answers[3]}</button>
      </div>
      <span id="score">${score} / ${questions.results.length}</span>
    </div>
    `;
    app.innerHTML = html;
    console.log(id);

    if (id === 9) {
      setTimeout(() => {
        app.innerHTML = `
        
        ${score} of ${questions.results.length}
        `;
      }, 1000);
    }
  }
}
