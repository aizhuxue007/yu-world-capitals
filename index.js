import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: 'postgres',
  password: 'jesus',
  host: 'localhost',
  port: 5433,
  database: 'world'
})

let quiz = [];

// db.connect();
// db.query("SELECT * FROM capitals", (err, res) => {
//   if (err) {
//     console.error("Error executing query", err.stack);
//   } else {
//     quiz = res.rows;
//   }
//   db.end();
// });

db.connect()
db.query('SELECT * FROM public.capitals ORDER BY id ASC', (err, res) => {
  if (err) {
    console.error(error)
  } else {
    quiz = res.rows
    console.log(quiz)
  }
})

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomCountry;
  console.log(currentQuestion);
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
