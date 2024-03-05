//  Default variables for game options
let difficulty = "easy";
let questionAmount = 5;
let currentCategory;
const optionDisplay = document.getElementById("displayoptions");
// Function for difficulty select
selectDifficulty = (level) => {
  difficulty = level;
  updateDisplay();
  return difficulty;
};
// Fade out score screen and reload
scoreFade = () => {
  const scoreWrapper = document.getElementById("score-wrapper");
  scoreWrapper.classList.remove("fade-in");
  scoreWrapper.classList.add("fade-out-fast");
  setTimeout(() => {
    location.reload();
  }, 500);
};
scoreFadeStats = () => {
  const scoreWrapper = document.getElementById("score-wrapper");
  scoreWrapper.classList.remove("fade-in");
  scoreWrapper.classList.add("fade-out-fast");
  setTimeout(() => {
    location.assign("/stats");
  }, 500);
};

// Function for amount of questions
selectAmount = (amount) => {
  questionAmount = amount;
  updateDisplay();
  return questionAmount;
};
//Swiper for category selection
const swiper = new Swiper(".swiper-container", {
  centeredSlides: true,
  slidesOffsetBefore: 0,
  slidesOffsetAfter: 0,
  speed: 500,
  slidesPerView: 1,
  spaceBetween: 0,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  on: {
    init: function () {
      currentCategory = getCurrentCategory(this); // Update currentCategory
    },
    slideChangeTransitionEnd: function () {
      currentCategory = getCurrentCategory(this); // Update currentCategory
    },
  },
});

// Function to get the current category
function getCurrentCategory(swiper) {
  // Get the active slide element
  let activeSlideElement = swiper.slides[swiper.activeIndex];

  // Get the text content of the active slide
  let category = activeSlideElement.textContent;

  // If the category is "Any", return an empty string
  if (category.toLowerCase() === "any") {
    return "";
  }

  // Format the category to match the API requirements
  category = category.toLowerCase(); // convert to lowercase
  category = category.replace(/ /g, "_"); // replace spaces with underscores

  return category;
}
// Fetch question data
async function fetchQuestions() {
  let apiURL = `https://the-trivia-api.com/v2/questions?limit=${questionAmount}`;

  // If the difficulty is not "random", add it as a query parameter
  if (difficulty.toLowerCase() !== "random") {
    apiURL += `&difficulties=${difficulty}`;
  }

  // If the category is not an empty string, add it as a query parameter
  if (currentCategory) {
    apiURL += `&categories=${currentCategory}`;
  }

  const response = await fetch(apiURL);
  const questions = await response.json();
  return questions;
}
// Function to Shuffle an Array
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

let isUpdating = false;

// Function to update the options display
function updateDisplay() {
  // If an update is already in progress, don't do anything
  if (isUpdating) return;

  // Indicate that an update is in progress
  isUpdating = true;

  // Start the hide animation
  optionDisplay.classList.add("hide");

  // Wait for the hide animation to end before updating the content
  setTimeout(() => {
    // Update the content
    optionDisplay.innerHTML = `${questionAmount
      .toString()
      .replace(/^\w/, (c) => c.toUpperCase())} Questions on ${
      difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
    } Difficulty`;

    // Start the show animation
    optionDisplay.classList.remove("hide");

    // Wait for the show animation to end before allowing another update
    setTimeout(() => {
      // Indicate that the update is complete
      isUpdating = false;
    }, 500); // Replace 500 with the duration of your show animation
  }, 500); // Replace 500 with the duration of your hide animation
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
  <div class="triviaWrapper fade-in" id="triviaWrapper">
    <img
      class="questionMarkIcon"
      src="./images/icons8-question-96.png"
      alt="Question-mark icon"
      srcset=""
    />
    <h1 class="titleText triviaTitle">Trivia Challenge</h1>
    <div id="triviaContainer" class="triviaContainer">
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
    </div>
      `;
  app.innerHTML = html;
  let answered = false;
  // Function to check the answer
  checkAnswer = (selectedChoice) => {
    // Fade out the trivia container
    const triviaWrapper = document.getElementById("triviaWrapper");
    triviaWrapper.classList.remove("fade-in");
    triviaWrapper.classList.add("fade-out");

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
      app.innerHTML = `
      <div id="score-wrapper" class="score-wrapper fade-in">
      <h2 class="titleText">You got ${score} of ${questions.length} answers correct.</h2>
      <div class="final-buttons">
        <button onclick="scoreFade()">Try Again</button>
        <button onclick="scoreFadeStats()">View Stats</button>
      </div>
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
    <div class="triviaWrapper fade-in" id="triviaWrapper">
      <img
        class="questionMarkIcon"
        src="./images/icons8-question-96.png"
        alt="Question-mark icon"
        srcset=""
      />
      <h1 class="titleText triviaTitle">Trivia Challenge</h1>
      <div id="triviaContainer" class="triviaContainer">
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
      </div>
        `;
    app.innerHTML = html;
  };
};
