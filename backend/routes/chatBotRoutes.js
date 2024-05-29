import express from 'express';
const chatBotRouter = express.Router();
import { Question, Answer } from '../models/chatbotModel.js';
import expressAsyncHandler from 'express-async-handler';

// GET pentru a obține toate întrebările
chatBotRouter.get(
  '/questions',
  expressAsyncHandler(async (req, res) => {
    const questions = await Question.find({});
    res.send(questions);
  })
);

// POST pentru a crea o întrebare nouă
chatBotRouter.post(
  '/questions',
  expressAsyncHandler(async (req, res) => {
    const question = new Question({
      text: req.body.text,
      category: req.body.category,
    });

    const createdQuestion = await question.save();
    res.status(201).send(createdQuestion);
  })
);

// GET pentru a obține toate răspunsurile unei întrebări
chatBotRouter.get(
  '/questions/:questionId/answers',
  expressAsyncHandler(async (req, res) => {
    const answers = await Answer.find({ question: req.params.questionId });
    res.send(answers);
  })
);

// POST pentru a adăuga un răspuns la o întrebare existentă
chatBotRouter.post(
  '/questions/:questionId/answers',
  expressAsyncHandler(async (req, res) => {
    const answer = new Answer({
      text: req.body.text,
      question: req.params.questionId,
    });

    const createdAnswer = await answer.save();
    res.status(201).send(createdAnswer);
  })
);

chatBotRouter.post(
  '/questions/compare',
  expressAsyncHandler(async (req, res) => {
    const { text } = req.body;

    const existingQuestions = await Question.find({});

    const similarQuestions = existingQuestions.filter((question) => {
      const levenshteinDistance = calculateLevenshteinDistance(
        text,
        question.text
      );

      const threshold = 3;

      return levenshteinDistance <= threshold;
    });

    res.send(similarQuestions);
  })
);

function calculateLevenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const d = [];

  for (let i = 0; i <= m; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    d[0][j] = j;
  }

  for (let j = 1; j <= n; j++) {
    for (let i = 1; i <= m; i++) {
      if (s1[i - 1] === s2[j - 1]) {
        d[i][j] = d[i - 1][j - 1];
      } else {
        d[i][j] = Math.min(
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + 1
        );
      }
    }
  }

  return d[m][n];
}

export default chatBotRouter;
