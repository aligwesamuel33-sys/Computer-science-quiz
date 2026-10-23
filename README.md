# Computer Science Quiz

## Project Description

This Computer Science Quiz is a responsive beginner project built with plain HTML, CSS and JavaScript. Learners answer twelve multiple-choice questions on computer fundamentals, JavaScript and web development, one at a time, with a progress bar and locked answers after submission. An array of question objects holds the options and the answer key, while functions calculate scores, percentages and performance messages. Fictional Nigerian student names appear in a clearly illustrative scoreboard. No login, backend, database or external service is needed, so the project can be uploaded directly to GitHub Pages.

## Features

- Twelve questions, one at a time, each with exactly four options and one correct answer
- Question counter ("Question 3 of 12") and a progress bar
- Next is blocked until an answer is chosen; Back is disabled on the first question
- The last question's button becomes **Submit Quiz**
- Results screen with score, percentage, performance message and a locked answer review
- **Restart Quiz** button that resets everything
- Illustrative scoreboard with fictional names (made-up scores, not real results)

## Quiz Structure

Questions are stored in the `QUESTIONS` array in `script.js`:

```js
{
  question: "What does CPU stand for?",
  options: ["Computer Personal Unit", "Central Processing Unit", "Central Program Utility", "Control Processing Unit"],
  answer: 1 // index of the correct option (0 to 3)
}
```

The `answer` number is the answer key.

## How Answers Are Stored

`userAnswers` is an array with one slot per question, filled with `null` at the start. Choosing an option saves its index in that question's slot (`userAnswers[currentIndex] = optionIndex`). Because each slot holds a single number, only one answer per question is possible, and changing your mind simply replaces it. After the quiz is submitted, a `submitted` flag stops any further changes.

## How Scoring Works

`calculateScore()` loops through every question and adds 1 whenever `userAnswers[i]` equals `QUESTIONS[i].answer`.

- Percentage = score ÷ number of questions × 100
- 80% and above: **Excellent work!**
- 50% to 79.99%: **Good effort. Keep practising.**
- Below 50%: **Keep learning and try again.**

## How Progress Is Calculated

Progress = (current question number ÷ total questions) × 100. For example, question 6 of 12 shows 50%.

## How to Restart

Press **Restart Quiz** on the results screen. `restartQuiz()` sets the question index to 0, refills `userAnswers` with `null`, clears the `submitted` flag and shows the first question again.

## File Structure

```
index.html   welcome, quiz and results screens
style.css    navy and green design, responsive rules
script.js    question data, rendering, scoring, events
README.md    this file
```

## Running Locally

1. Keep the four files in the same folder (or a GitHub repository root).
2. Open `index.html` in any modern browser, or enable GitHub Pages.

No installation, build step, backend or API key is required.

## Limitations

- The answer key is visible in `script.js`, so this is not suitable for secure or graded exams.
- Scores are not saved; refreshing the page starts over.
- The scoreboard is fictional and for demonstration only.
