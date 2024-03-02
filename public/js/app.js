// Some default variables for game options
let difficulty = "easy";
let questionAmount = 5;

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
amount5 = () => {
  return (questionAmount = 5);
};
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
  let apiURL = `https://the-trivia-api.com/v2/questions?limit=${questionAmount}&difficulties=${difficulty}`;
  const response = await fetch(apiURL);
  const questions = await response.json();
  return questions;
}

startGame = async () => {
  // Send data to the server
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
  const answers = questions[qNumID].incorrectAnswers.concat(
    questions[qNumID].correctAnswer
  );
  shuffle(answers);
  // Template for Trivia questions and answers
  html += `
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
      `;
  app.innerHTML = html;

  let answered = false;
  checkAnswer = (selectedChoice) => {
    const triviaContainer = document.getElementById("triviaContainer");

    triviaContainer.classList.remove("fade-in");
    triviaContainer.classList.add("fade-out");
    let correctAnswer = `${questions[qNumID].correctAnswer}`;
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
            category: `${questions[qNumID].category}`,
            difficulty: `${questions[qNumID].difficulty}`,
          },
        ],
      };
      sendDataToDatabase(correctWrite);
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      selectedChoice.style.backgroundColor = "#FF6565";

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
      setTimeout(() => {
        nextQuestion();
      }, 1500);
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
    
    if (qNumID == questionAmount - 1) {
      app.innerHTML = `<h3>You got ${score} of ${questions.length} answers correct.</h3>
      <button id="retry" onclick="location.reload()">Try Again</button>
      `;
      return
    }
    qNumID++;
    let html = "";
    const answers = questions[qNumID].incorrectAnswers.concat(
      questions[qNumID].correctAnswer
    );
    shuffle(answers);
    html += `
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
        `;
    app.innerHTML = html;
  };
};