import app from "@src/app";
import { clickDay } from "@src/features/database";
import request from "supertest";

describe("POST /attempts questions options length should be a random number", () => {
  afterEach(async () => {
    await clickDay.tables.CdAttempts.do().delete();
    await clickDay.tables.CdAttemptsQuestions.do().delete();
  });

  it("Should return options length random in range 6-9 for email question", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");

    const optionsLength = response.body.questions.find(
      (question: { slug: string }) => question.slug === "email"
    ).options.length;
    console.log(optionsLength);
    expect(optionsLength).toBeGreaterThanOrEqual(6);
    expect(optionsLength).toBeLessThanOrEqual(9);
  });
});
