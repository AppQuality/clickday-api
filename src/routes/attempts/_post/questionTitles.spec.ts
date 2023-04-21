import app from "@src/app";
import { clickDay } from "@src/features/database";
import request from "supertest";

describe("POST /attempts questions titles", () => {
  afterEach(async () => {
    await clickDay.tables.CdAttempts.do().delete();
    await clickDay.tables.CdAttemptsQuestions.do().delete();
  });
  //get all questions slugs

  const questionTypesWithAnswers = [
    "email",
    "month-vocals",
    "bando",
    "last-numbers-bando",
    "amount",
    "axis",
    "moment-date",
  ];

  test.each(questionTypesWithAnswers)(
    "Should return correct answer in title for %s question",
    async (questionType) => {
      const response = await request(app)
        .post("/attempts")
        .send({
          code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
        })
        .set("authorization", "Bearer tester");

      const question = await clickDay.tables.CdAttemptsQuestions.do()
        .select("correct_answer")
        .where({ attempt_id: response.body.id, type: questionType })
        .first();
      expect(response.body.questions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            slug: questionType,
          }),
        ])
      );
      if (!question) throw new Error("Question not found");
      expect(response.body.questions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            slug: questionType,
            title: expect.stringContaining(question.correct_answer),
          }),
        ])
      );
    }
  );
});
