//  Global Variables
let difficulty = "easy";
let questionAmount = 5;
let questions;
let qNumID = 0;
let score = 0;
let currentCategory;
let isFiftyFiftyUsed = false;
let isPhoneAFriendUsed = false;
let answered = false;
const app = document.querySelector("#app");
const correctSound = new Audio("../sounds/correct.wav");
const incorrectSound = new Audio("../sounds/buzzer-or-wrong-answer-20582.wav");
const cheerSound = new Audio("../sounds/applause.mp3");
const losingHorn = new Audio("../sounds/losing-horn.mp3");
const wowSound = new Audio("../sounds/wowzer.wav");

// Function to Shuffle an Array
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
// Functions to open and close the modal
openModal = () => {
  const howto = document.getElementById("howto");
  howto.style.display = "flex";
  setTimeout(() => {
    howto.style.opacity = "1";
  }, 50);
};
closeModal = () => {
  const howto = document.getElementById("howto");
  howto.style.opacity = "0";

  setTimeout(() => {
    howto.style.display = "none";
  }, 500);
};
document.getElementById("howto-close").addEventListener("click", closeModal);

// Function to highlight the selected button per group
function handleButtonClick(event) {
  const buttonGroup = event.target.parentNode;
  buttonGroup.querySelectorAll("button").forEach((button) => {
    button.classList.remove("selected");
  });

  event.target.classList.add("selected");
}

document
  .querySelectorAll(".difficultyBtns button, .questionAmount button")
  .forEach((button) => {
    button.addEventListener("click", handleButtonClick);
  });

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

// Game Options
selectDifficulty = (level) => {
  difficulty = level;
  return difficulty;
};
selectAmount = (amount) => {
  questionAmount = amount;
  return questionAmount;
};
function getCurrentCategory(swiper) {
  let activeSlideElement = swiper.slides[swiper.activeIndex];
  let category = activeSlideElement.textContent;
  if (category.toLowerCase() === "any") {
    return "";
  }
  // Format the category to match the API requirements
  category = category.toLowerCase();
  category = category.replace(/ /g, "_");

  return category;
}

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

// Functions for 50/50 and Phone a Friend Lifelines
fiftyFifty = () => {
  if (isFiftyFiftyUsed) {
    return;
  }
  const answers = document.getElementsByClassName("answer");
  let removed = 0;
  for (let i = 0; i < answers.length; i++) {
    if (
      answers[i].innerText !== questions[qNumID].correctAnswer &&
      removed < 2
    ) {
      answers[i].innerText = "";
      answers[i].style.backgroundColor = "rgba(0, 0, 0, 0.5)";

      removed++;
    }
  }
  document.getElementById("fiftyFifty").disabled = true;
  isFiftyFiftyUsed = true;
};

phoneAFriend = () => {
  if (isPhoneAFriendUsed) {
    return;
  }
  const friendText = document.getElementById("friend-answer");
  const friendContainer = document.getElementById("friend-wrapper");

  let friendAnswer;
  const accuracy = Math.random() * 100;

  let incorrectAnswers = questions[qNumID].incorrectAnswers;
  let randomIndex = Math.floor(Math.random() * incorrectAnswers.length);
  let randomIncorrectAnswer = incorrectAnswers[randomIndex];

  switch (difficulty) {
    case "easy":
      friendAnswer = questions[qNumID].correctAnswer;
      break;
    case "medium":
      if (accuracy <= 85) {
        friendAnswer = questions[qNumID].correctAnswer;
      } else {
        friendAnswer = randomIncorrectAnswer;
      }
      break;
    case "hard":
      if (accuracy <= 70) {
        friendAnswer = questions[qNumID].correctAnswer;
      } else {
        friendAnswer = randomIncorrectAnswer;
      }
      break;
  }

  friendText.innerText = `Your friend thinks the answer is: ${friendAnswer}`;
  document.getElementById("phoneAFriend").disabled = true;
  isPhoneAFriendUsed = true;
  friendContainer.style.transform = "translateX(0)";
};

closeFriend = () => {
  const friendContainer = document.getElementById("friend-wrapper");
  friendContainer.style.transform = "translateX(-100%)";
};

// Fetch question data
async function fetchQuestions() {
  let apiURL = `https://the-trivia-api.com/v2/questions?limit=${questionAmount}`;

  if (difficulty.toLowerCase() !== "random") {
    apiURL += `&difficulties=${difficulty}`;
  }
  if (currentCategory) {
    apiURL += `&categories=${currentCategory}`;
  }

  const response = await fetch(apiURL);
  const questions = await response.json();
  return questions;
}

// Send data to local JSON server
async function sendDataToDatabase(data) {
  const response = await fetch("http://localhost:3000/api/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error response:", errorData);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Check the answer logic and data sending
checkAnswer = (selectedChoice) => {
  // Fade out the trivia container
  const triviaWrapper = document.getElementById("triviaWrapper");
  triviaWrapper.classList.remove("fade-in");
  triviaWrapper.classList.add("fade-out");
  stopTimer();
  let correctAnswer = `${questions[qNumID].correctAnswer}`;
  if (answered) {
    return;
  }

  if (selectedChoice.innerText === correctAnswer) {
    correctSound.play();
    selectedChoice.style.backgroundColor = "#00FF73";
    score++;
    document.getElementById(
      "score"
    ).innerHTML = `${score} <span class="score-divider">//</span> ${questions.length}`;
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
    incorrectSound.play();
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

// Initialize game
startGame = async () => {
  let html = "";
  questions = await fetchQuestions();
  const answers = questions[qNumID].incorrectAnswers.concat(
    questions[qNumID].correctAnswer
  );
  shuffle(answers);
  html += `
  <div class="triviaWrapper fade-in" id="triviaWrapper">
    <div id="timer">20</div>
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
    <div class="button-box">
      <button onclick="fiftyFifty()" id="fiftyFifty">50/50</button>
      <div class="score-box">
        <div class="score-title">Score</div>
        <div class="score" id="score">${score} <span class="score-divider">//</span> ${questions.length}</div>
      </div>

      <button onclick="phoneAFriend()" id="phoneAFriend"><img class="phone-icon" src="./images/phone-call-svgrepo-com.svg" alt="" srcset=""></button>
    </div>
  </div>
  <div class="friend-wrapper friend-wrapper-out" id="friend-wrapper">
    <div class="friend-container">
      <div class="close-box" id="closeBox"><img src="./images/icons8-close-48.png" alt=""></div>
      <div class="thought" id="friend-answer"></div>
      <img class="friend" src="./images/nerd-svgrepo-com.svg" alt="" srcset="">
    </div>
  </div>
      `;
  app.innerHTML = html;
  document.getElementById("closeBox").addEventListener("click", closeFriend);
  startTimer = () => {
    const timerElement = document.getElementById("timer");
    let timeRemaining = 20;
    timer = setInterval(() => {
      timeRemaining--;
      timerElement.textContent = timeRemaining;

      if (timeRemaining <= 0) {
        clearInterval(timer);
        nextQuestion();
      }
    }, 1500);
  };
  stopTimer = () => {
    clearInterval(timer);
  };

  // Next question function
  nextQuestion = () => {
    answered = false;
    // Score result screen when all questions are answered
    if (qNumID == questionAmount - 1) {
      if (score === questionAmount) {
        wowSound.play();
      } else if (score > questionAmount / 2) {
        cheerSound.play();
      } else if (score <= questionAmount / 2) {
        losingHorn.play();
      }
      app.innerHTML = `
      <div class="confetti-container">
    <div class="confetti"></div>
    <div class="confetti"></div>
    <div class="confetti"></div>
    <div class="confetti"></div>
    <div class="confetti"></div>
    <div class="confetti"></div>
    <div class="confetti"></div>
    <div class="confetti"></div>
    <div class="confetti"></div>
    <div class="confetti"></div>
    <div class="confetti"></div>
    <div class="confetti"></div>
    <div class="confetti"></div>
    <div class="confetti"></div>
    <div class="confetti"></div>
  </div>
  <div id="score-wrapper" class="score-wrapper fade-in">
    <h2 class="titleText">Congratulations!</h2>
    <h2 class="titleText">You got ${score} of ${questions.length} answers correct.</h2>
    <div class="final-buttons">
      <button onclick="scoreFade()">Try Again</button>
      <button onclick="scoreFadeStats()">View Stats</button>
    </div>
  </div>
      `;
      return;
    }
    qNumID++;
    let html = "";
    const answers = questions[qNumID].incorrectAnswers.concat(
      questions[qNumID].correctAnswer
    );
    shuffle(answers);
    html += `
    <div class="triviaWrapper fade-in" id="triviaWrapper">
    <div id="timer">20</div>
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
    <div class="button-box">
      <button onclick="fiftyFifty()" id="fiftyFifty">50/50</button>
      <div class="score-box">
        <div class="score-title">Score</div>
        <div class="score" id="score">${score} <span class="score-divider">//</span> ${questions.length}</div>
      </div>

      <button onclick="phoneAFriend()" id="phoneAFriend"><img class="phone-icon" src="./images/phone-call-svgrepo-com.svg" alt="" srcset=""></button>
    </div>
  </div>
  <div class="friend-wrapper friend-wrapper-out" id="friend-wrapper">
    <div class="friend-container">
      <div class="close-box" id="closeBox"><img src="./images/icons8-close-48.png" alt=""></div>
      <div class="thought" id="friend-answer">Lorem ipsum, dolor sit amet consectetur adipisicing.</div>
      <img class="friend" src="./images/nerd-svgrepo-com.svg" alt="" srcset="">
    </div>
  </div>
        `;
    app.innerHTML = html;
    document.getElementById("closeBox").addEventListener("click", closeFriend);
    startTimer();

    // Disable lifelines if they have been used
    if (isFiftyFiftyUsed) {
      const fiftyFiftyButton = document.getElementById("fiftyFifty");
      fiftyFiftyButton.disabled = true;
      fiftyFiftyButton.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
      fiftyFiftyButton.style.cursor = "not-allowed";
      fiftyFiftyButton.classList.add("used");
    }

    if (isPhoneAFriendUsed) {
      const phoneAFriendButton = document.getElementById("phoneAFriend");
      phoneAFriendButton.disabled = true;
      phoneAFriendButton.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
      phoneAFriendButton.style.cursor = "not-allowed";
      phoneAFriendButton.classList.add("used");
    }
  };
  startTimer();
};
