import app from "@src/app";
import { clickDay } from "@src/features/database";
import request from "supertest";

describe("POST /attempts questions options length should be a random number", () => {
  afterEach(async () => {
    await clickDay.tables.CdAttempts.do().delete();
    await clickDay.tables.CdAttemptsQuestions.do().delete();
  });

  const questionsOptionsRanges = [
    { slug: "email", minOptions: 6, maxOptions: 9 },
    { slug: "month-vocals", minOptions: 6, maxOptions: 12 },
    { slug: "last-numbers-bando", minOptions: 3, maxOptions: 6 },
    { slug: "bando", minOptions: 4, maxOptions: 6 },
    { slug: "amount", minOptions: 6, maxOptions: 9 },
    { slug: "axis", minOptions: 5, maxOptions: 8 },
    { slug: "moment-date", minOptions: 5, maxOptions: 9 },
  ];

  test.each(questionsOptionsRanges)(
    "Should return options length random in range for %s question",
    async (currentQuestion) => {
      const response = await request(app)
        .post("/attempts")
        .send({
          code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
        })
        .set("authorization", "Bearer tester");

      const optionsLength = response.body.questions.find(
        (question: { slug: string }) => question.slug === currentQuestion.slug
      ).options.length;

      expect(optionsLength).toBeGreaterThanOrEqual(currentQuestion.minOptions);
      expect(optionsLength).toBeLessThanOrEqual(currentQuestion.maxOptions);
    }
  );
});
