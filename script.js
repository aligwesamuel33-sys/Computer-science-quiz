(function () {
  "use strict";

  /* ---------- Question data (the answer key lives here) ---------- */
  // Each question: the statement, exactly four options, and `answer` = index (0-3) of the correct option.
  var QUESTIONS = [
    { question: "What does CPU stand for?",
      options: ["Computer Personal Unit", "Central Processing Unit", "Central Program Utility", "Control Processing Unit"], answer: 1 },
    { question: "Which of these is an input device?",
      options: ["Monitor", "Keyboard", "Printer", "Speaker"], answer: 1 },
    { question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "HighText Machine Language", "HyperTool Multi Language", "Home Text Markup Language"], answer: 0 },
    { question: "Which CSS property changes the colour of text?",
      options: ["font-style", "text-decoration", "color", "background"], answer: 2 },
    { question: "Which JavaScript keyword declares a block-scoped variable that can be reassigned?",
      options: ["def", "var", "const", "let"], answer: 3 },
    { question: "What does typeof \"Hello\" return in JavaScript?",
      options: ["number", "string", "boolean", "undefined"], answer: 1 },
    { question: "Which operator checks strict equality (value AND type) in JavaScript?",
      options: ["=", "==", "===", "=>"], answer: 2 },
    { question: "What is the binary number 101 in decimal?",
      options: ["3", "4", "6", "5"], answer: 3 },
    { question: "Which type of memory loses its contents when the power is switched off?",
      options: ["RAM", "Hard disk", "SSD", "Flash drive"], answer: 0 },
    { question: "Which HTML tag creates the largest heading?",
      options: ["<head>", "<heading>", "<h1>", "<h6>"], answer: 2 },
    { question: "Which array method adds an item to the END of an array?",
      options: ["push()", "pop()", "shift()", "slice()"], answer: 0 },
    { question: "What does URL stand for?",
      options: ["Universal Resource Link", "Uniform Resource Locator", "Unified Routing Language", "User Resource Locator"], answer: 1 }
  ];

  // Fictional, illustrative scores for the welcome screen only (not real results).
  var SAMPLE_BOARD = [
    { name: "Chiamaka Okafor", score: 11 },
    { name: "Oluwaseun Adeyemi", score: 9 },
    { name: "Basiru Ibrahim", score: 7 },
    { name: "Efion Ekanem", score: 5 }
  ];

  var LETTERS = ["A", "B", "C", "D"];

  /* ---------- Quiz state ---------- */
  var currentIndex = 0;                                  // which question is showing
  var userAnswers = new Array(QUESTIONS.length).fill(null); // chosen option index per question (null = unanswered)
  var submitted = false;                                 // true once Submit Quiz is pressed (locks answers)

  var $ = function (id) { return document.getElementById(id); };

  function showScreen(name) {
    $("welcomeScreen").hidden = name !== "welcome";
    $("quizScreen").hidden = name !== "quiz";
    $("resultScreen").hidden = name !== "result";
  }

  /* ---------- Rendering ---------- */

  // Progress = current question number / total questions, as a percentage.
  function updateProgress() {
    var pct = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);
    $("questionCounter").textContent = "Question " + (currentIndex + 1) + " of " + QUESTIONS.length;
    $("progressText").textContent = pct + "%";
    $("progressFill").style.width = pct + "%";
    $("progressBar").setAttribute("aria-valuenow", pct);
  }

  // Draw the current question and its four options. Re-highlights a saved answer when moving back/forward.
  function renderQuestion() {
    var q = QUESTIONS[currentIndex];
    $("questionText").textContent = q.question;
    $("hint").textContent = "";
    var box = $("options");
    box.innerHTML = "";

    for (var i = 0; i < q.options.length; i++) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option" + (userAnswers[currentIndex] === i ? " selected" : "");
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", userAnswers[currentIndex] === i ? "true" : "false");
      btn.setAttribute("data-index", i);

      var letter = document.createElement("span");
      letter.className = "letter";
      letter.textContent = LETTERS[i];
      var label = document.createElement("span");
      label.textContent = q.options[i];
      btn.appendChild(letter);
      btn.appendChild(label);
      box.appendChild(btn);
    }

    updateProgress();
    // Boundaries: Back is disabled on the first question; the last question's button becomes Submit Quiz.
    $("backBtn").disabled = currentIndex === 0;
    $("nextBtn").textContent = currentIndex === QUESTIONS.length - 1 ? "Submit Quiz" : "Next";
  }

  /* ---------- Answer selection ---------- */

  // Only one answer per question: saving a new index simply replaces the old one.
  function selectAnswer(optionIndex) {
    if (submitted) { return; } // answers are locked after submission
    userAnswers[currentIndex] = optionIndex;
    $("hint").textContent = "";
    var buttons = $("options").children;
    for (var i = 0; i < buttons.length; i++) {
      var on = i === optionIndex;
      buttons[i].classList.toggle("selected", on);
      buttons[i].setAttribute("aria-checked", on ? "true" : "false");
    }
  }

  /* ---------- Scoring ---------- */

  // Score = number of questions where the chosen index equals the answer key.
  function calculateScore() {
    var score = 0;
    for (var i = 0; i < QUESTIONS.length; i++) {
      if (userAnswers[i] === QUESTIONS[i].answer) { score++; }
    }
    return score;
  }

  // Performance bands use the unrounded percentage.
  function getPerformance(percentage) {
    if (percentage >= 80) { return { text: "Excellent work!", level: "high" }; }
    if (percentage >= 50) { return { text: "Good effort. Keep practising.", level: "mid" }; }
    return { text: "Keep learning and try again.", level: "low" };
  }

  function renderReview() {
    var list = $("review");
    list.innerHTML = "";
    for (var i = 0; i < QUESTIONS.length; i++) {
      var q = QUESTIONS[i];
      var correct = userAnswers[i] === q.answer;
      var li = document.createElement("li");

      var qEl = document.createElement("div");
      qEl.className = "q";
      qEl.textContent = q.question;
      var yours = document.createElement("div");
      yours.className = correct ? "ok" : "bad";
      yours.textContent = (correct ? "✓ Your answer: " : "✗ Your answer: ") + q.options[userAnswers[i]];
      li.appendChild(qEl);
      li.appendChild(yours);
      if (!correct) {
        var key = document.createElement("div");
        key.className = "ok";
        key.textContent = "Correct answer: " + q.options[q.answer];
        li.appendChild(key);
      }
      list.appendChild(li);
    }
  }

  function showResults() {
    submitted = true;
    var score = calculateScore();
    var percentage = (score / QUESTIONS.length) * 100;
    var perf = getPerformance(percentage);

    $("scoreValue").textContent = score + "/" + QUESTIONS.length;
    $("percentText").textContent = percentage.toFixed(1) + "%";
    $("performanceMsg").textContent = perf.text;
    $("performanceMsg").className = "perf " + perf.level;
    $("scoreCircle").className = "score-circle " + perf.level;
    renderReview();
    showScreen("result");
  }

  /* ---------- Restart ---------- */

  // Reset every piece of state, then show question 1 again.
  function restartQuiz() {
    currentIndex = 0;
    userAnswers = new Array(QUESTIONS.length).fill(null);
    submitted = false;
    renderQuestion();
    showScreen("quiz");
    window.scrollTo(0, 0);
  }

  /* ---------- Events ---------- */

  $("startBtn").addEventListener("click", restartQuiz);
  $("restartBtn").addEventListener("click", restartQuiz);

  // One listener on the options container handles all four buttons (event delegation).
  $("options").addEventListener("click", function (event) {
    var btn = event.target.closest(".option");
    if (btn) { selectAnswer(Number(btn.getAttribute("data-index"))); }
  });

  $("nextBtn").addEventListener("click", function () {
    // Cannot proceed until an answer has been chosen.
    if (userAnswers[currentIndex] === null) {
      $("hint").textContent = "Please select an answer before continuing.";
      return;
    }
    if (currentIndex === QUESTIONS.length - 1) {
      showResults();
    } else {
      currentIndex++;
      renderQuestion();
    }
  });

  $("backBtn").addEventListener("click", function () {
    if (currentIndex > 0) { currentIndex--; renderQuestion(); }
  });

  /* ---------- Initial welcome screen ---------- */
  $("totalInfo").textContent = QUESTIONS.length;
  SAMPLE_BOARD.forEach(function (row) {
    var li = document.createElement("li");
    li.textContent = row.name;
    var pts = document.createElement("span");
    pts.className = "pts";
    pts.textContent = row.score + "/" + QUESTIONS.length;
    li.appendChild(pts);
    $("sampleBoard").appendChild(li);
  });
  showScreen("welcome");
})();
