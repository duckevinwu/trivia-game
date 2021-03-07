// values
let questionArr = [];
let currentQuestion = null;
var correctOption = -1;
var scoreVal = 0;
var streakVal = 0;
var maxStreak = 0;
var highScore = 0;

// html elements
let categoryText = document.getElementById("category");
let questionText = document.getElementById("question");
let score = document.getElementById("score");
let streak = document.getElementById("streak");
let maxStreakDiv = document.getElementById("max-streak");
let highScoreDiv = document.getElementById("high-score");

// load questions to start
loadQuestions();

function resetInitialValues() {
  scoreVal = 0;
  streakVal = 0;
}

function loadQuestions() {
  fetch('https://opentdb.com/api.php?amount=10&type=multiple')
  .then(response => response.json())
  .then(data => {
    questionArr.push(...data.results);
    
    if (!currentQuestion) {
      currentQuestion = getNextValidQuestion();
      updateUI();
    }
    
    $("#game-container").removeClass("hide");
    }
  );
}

function updateUI() {
  $('input[name="answer"]').prop('checked', false);
  
  categoryText.innerHTML = currentQuestion.category;
  questionText.innerHTML = currentQuestion.question;
  score.innerHTML = scoreVal;
  streak.innerHTML = streakVal;
  maxStreakDiv.innerHTML = maxStreak;
  highScoreDiv.innerHTML = highScore;
  
  setupOptions();
  
}

function setupOptions() {
  let icLength = currentQuestion.incorrect_answers.length;
  
  correctOption = randomInt(1, 1 + icLength);
  $(`#label-${correctOption}`).html(currentQuestion.correct_answer);
  
  let currIndex = 0;
  
  for (let i = 1; i < icLength + 2; i++) {
    if (i === correctOption) {
      continue;
    }
    $(`#label-${i}`).html(currentQuestion.incorrect_answers[currIndex]);
    currIndex++;
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNextQuestion() {
  let nextQ = questionArr.shift();
  if (questionArr.length < 6) {
    loadQuestions();
  }
  return nextQ;
}

function getNextValidQuestion() {
  let nextQ = getNextQuestion();
  
  while (!isValidQuestion(nextQ)) {
    nextQ = getNextQuestion();
  }
  
  return nextQ;
}

function isValidQuestion(q) {
  return q.correct_answer && q.question
}


// handles selection of radio option
$('input[name="answer"]').on('click', function(e) {
  let selected = $("input[type='radio']:checked");
  let selectedVal = selected.val();
  if (isCorrect(selectedVal)) {
    var pointVal = 0;
    
    switch(currentQuestion.difficulty) {
      case "easy":
        pointVal = 1;
        break;
      case "hard":
        pointVal = 5;
        break;
      default:
        pointVal = 3;
        break;
    }
    
    scoreVal+=pointVal;
    streakVal++;
    updateHighScores();
    $(`#label-${selectedVal}`).addClass("correct");
  } else {
    resetInitialValues();
    $(`#label-${selectedVal}`).addClass("wrong");
  }
  $('input[name=answer]').attr("disabled",true);
});

function isCorrect(a) {
  return a == correctOption;
}

function updateHighScores() {
  if (scoreVal > highScore) {
    highScore = scoreVal;
  }
  
  if (streakVal > maxStreak) {
    maxStreak = streakVal;
  }
}

// callback triggered when css animation finished
for (let i = 1; i < 5; i++) {
  let optionLabel = $(`#label-${i}`);
  optionLabel.on('animationend', function(e) {
    optionLabel.removeClass("correct wrong");
    currentQuestion = getNextValidQuestion();
    updateUI();
    $('input[name=answer]').attr("disabled",false);
  });
}




