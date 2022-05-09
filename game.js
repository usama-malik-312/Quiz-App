const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let quesitonCounter = 0;
let score = 0;
let availableQuestions = [];
let acceptingAnswer = false;

let questions = [];

fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formatQuestions = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formatQuestions.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formatQuestions.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formatQuestions["choice" + (index + 1)] = choice;
      });

      return formatQuestions;
    });

    // questions = loadedQuestions;

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

// Constants

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
  quesitonCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestions();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestions = () => {
  if (availableQuestions.length === 0 || quesitonCounter > MAX_QUESTIONS) {
    //go to the end page
    localStorage.setItem("mostRecentScore", score);
    return window.location.assign("./end.html");
  }
  quesitonCounter++;
  progressText.innerText = `Question ${quesitonCounter}/${MAX_QUESTIONS}`;
  //Update the progress bar
  progressBarFull.style.width = `${(quesitonCounter / MAX_QUESTIONS) * 100}%`;

  const quesitonIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[quesitonIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(quesitonIndex, 1);
  acceptingAnswer = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    // console.log(e.target);
    if (!acceptingAnswer) return;
    acceptingAnswer = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply == "correct") {
      incrementScore(CORRECT_BONUS);
    }
    selectedChoice.parentElement.classList.add(classToApply);
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestions();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
