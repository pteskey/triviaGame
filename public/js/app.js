//  Default variables for game options
let difficulty = "easy";
let questionAmount = 5;
const optionDisplay = document.getElementById("displayoptions");

// Function to update the display
function updateDisplay() {
  optionDisplay.innerHTML = `${questionAmount
    .toString()
    .replace(/^\w/, (c) => c.toUpperCase())} Questions on ${
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  } Difficulty`;
}

// Function for difficulty select
selectDifficulty = (level) => {
  difficulty = level;
  updateDisplay();
  return difficulty;
};

// Function for amount of questions
selectAmount = (amount) => {
  questionAmount = amount;
  updateDisplay();
  return questionAmount;
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
  let apiURL = `https://the-trivia-api.com/v2/questions?limit=${questionAmount}&difficulties=${difficulty}`;
  const response = await fetch(apiURL);
  const questions = await response.json();
  return questions;
}
// Initialize game
startGame = async () => {
  // Async function to send data to local JSON server
  async function sendDataToDatabase(data) {
    console.log("Sending data:", data); // Log the data before sending it
    const response = await fetch("http://localhost:3000/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Try to parse the error response
      console.error("Error response:", errorData); // Log the error response
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  //Default variables
  const app = document.querySelector("#app");
  let html = "";
  let qNumID = 0;
  let score = 0;
  const questions = await fetchQuestions();
  // Group and shuffle answers
  const answers = questions[qNumID].incorrectAnswers.concat(
    questions[qNumID].correctAnswer
  );
  shuffle(answers);
  // Template for Trivia questions and answers
  html += `
  <img
  class="questionMarkIcon"
  src="./images/icons8-question-96.png"
  alt="Question-mark icon"
  srcset=""
  />
  
  <div id="triviaContainer" class="triviaContainer fade-in">
  <div class="questionBox">
    <div class="question">${questions[qNumID].question.text}</div>
  </div>
  <div class="answerBox">
    <div class="answer" onclick="checkAnswer(this)">${answers[0]}</div>
    <div class="answer" onclick="checkAnswer(this)">${answers[1]}</div>
    <div class="answer" onclick="checkAnswer(this)">${answers[2]}</div>
    <div class="answer" onclick="checkAnswer(this)">${answers[3]}</div>
  </div>
  </div>
  <h1 class="triviaTitle">Trivia Challenge</h1>
      `;
  app.innerHTML = html;
  let answered = false;
  // Function to check the answer
  checkAnswer = (selectedChoice) => {
    // Fade out the trivia container
    const triviaContainer = document.getElementById("triviaContainer");
    triviaContainer.classList.remove("fade-in");
    triviaContainer.classList.add("fade-out");

    let correctAnswer = `${questions[qNumID].correctAnswer}`;
    if (answered) {
      return;
    }
    // Conditional to check if the selected answer is correct or not
    if (selectedChoice.innerText === correctAnswer) {
      selectedChoice.style.backgroundColor = "#00FF73";
      score++;
      // Send data to local JSON server
      const correctWrite = {
        questions: [
          {
            correctlyAnswered: true,
            category: `${questions[qNumID].category}`,
            difficulty: `${questions[qNumID].difficulty}`,
          },
        ],
      };
      sendDataToDatabase(correctWrite);
      // Goto next question after 1.5 seconds
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      selectedChoice.style.backgroundColor = "#FF6565";
      // Send data to local JSON server
      const incorrectWrite = {
        questions: [
          {
            correctlyAnswered: false,
            category: `${questions[qNumID].category}`,
            difficulty: `${questions[qNumID].difficulty}`,
          },
        ],
      };
      sendDataToDatabase(incorrectWrite);
      // Goto next question after 1.5 seconds
      setTimeout(() => {
        nextQuestion();
      }, 1500);
      // Highlight correct answer if you chose wrong
      let choices = document.getElementsByClassName("answer");
      for (let i = 0; i < choices.length; i++) {
        if (choices[i].innerText === correctAnswer) {
          choices[i].style.backgroundColor = "#00FF73";
        }
      }
    }
    //Lockout ability to answer
    answered = true;
  };
  // Function to move to the next question
  nextQuestion = () => {
    //Reset answer status
    answered = false;
    // Score result screen when all questions are answered
    if (qNumID == questionAmount - 1) {
      app.innerHTML = `<h2 class="titleText">You got ${score} of ${questions.length} answers correct.</h2>
       <div class="final-buttons"> 
        <button onclick="location.reload()">Try Again</button>
        <a href="/stats"><button>View Stats</button></a>
      </div>
      `;
      return;
    }
    //Increment question number
    qNumID++;
    let html = "";
    // Group and shuffle answers
    const answers = questions[qNumID].incorrectAnswers.concat(
      questions[qNumID].correctAnswer
    );
    shuffle(answers);
    // Template for Trivia questions and answers
    html += `
    <img
    class="questionMarkIcon"
    src="./images/icons8-question-96.png"
    alt="Question-mark icon"
    srcset=""
    />
    
    <div id="triviaContainer" class="triviaContainer fade-in">
    <div class="questionBox">
      <div class="question">${questions[qNumID].question.text}</div>
    </div>
    <div class="answerBox">
      <div class="answer" onclick="checkAnswer(this)">${answers[0]}</div>
      <div class="answer" onclick="checkAnswer(this)">${answers[1]}</div>
      <div class="answer" onclick="checkAnswer(this)">${answers[2]}</div>
      <div class="answer" onclick="checkAnswer(this)">${answers[3]}</div>
    </div>
    </div>
    <h1 class="triviaTitle">Trivia Challenge</h1>
    `;
    app.innerHTML = html;
  };
};
