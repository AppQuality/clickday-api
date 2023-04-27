import app from "@src/app";
import { clickDay } from "@src/features/database";
import request from "supertest";

describe("POST /attempts questions titles", () => {
  afterEach(async () => {
    await clickDay.tables.CdAttempts.do().delete();
    await clickDay.tables.CdAttemptsQuestions.do().delete();
  });

  const questionTypesWithAnswers = [
    "email",
    "bando",
    "last-numbers-bando",
    "amount",
    "axis",
    "moment-date",
  ];

  const italianMonths = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
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

  it("Should not contain correct answer in title for today/yesterday/tomorrow question", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");

    const question = await clickDay.tables.CdAttemptsQuestions.do()
      .select("type", "correct_answer")
      .where({ attempt_id: response.body.id })
      .whereIn("type", ["today", "yesterday", "tomorrow"])
      .first();
    if (!question)
      throw new Error("No question found for today/yesterday/tomorrow");

    const questionType = question.type;
    expect(response.body.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: questionType,
        }),
      ])
    );
    expect(response.body.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: questionType,
          title: expect.not.stringContaining(question.correct_answer),
        }),
      ])
    );
  });

  it("Should not contain correct answer in title for first/last - character/numbers question", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");

    const question = await clickDay.tables.CdAttemptsQuestions.do()
      .select("type", "correct_answer")
      .where({ attempt_id: response.body.id })
      .whereIn("type", [
        "first-characters",
        "last-characters",
        "first-numbers",
        "last-numbers",
      ])
      .first();
    if (!question)
      throw new Error("No question found for first/last - character/numbers");

    const questionType = question.type;
    expect(response.body.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: questionType,
        }),
      ])
    );
    expect(response.body.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: questionType,
          title: expect.not.stringContaining(question.correct_answer),
        }),
      ])
    );
  });

  it("Should not contain correct answer in title for month-vocals question", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");

    const questionType = "month-vocals";
    const question = await clickDay.tables.CdAttemptsQuestions.do()
      .select("type", "correct_answer")
      .where({ attempt_id: response.body.id })
      .whereIn("type", [questionType])
      .first();
    if (!question)
      throw new Error("No question found for first/last - character/numbers");

    expect(response.body.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: questionType,
        }),
      ])
    );
    expect(response.body.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: questionType,
          title: expect.not.stringContaining(question.correct_answer),
        }),
      ])
    );
  });

  // test.each(italianMonths)(
  //   "Should contain %s in question month vocals  when month is %s",
  //   async (currentMonth) => {
  //     const response = await request(app)
  //       .post("/attempts")
  //       .send({
  //         code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
  //       })
  //       .set("authorization", "Bearer tester");

  //     const monthVocalQuestion = response.body.questions.find(
  //       (question: { slug: string }) => question.slug === 'month-vocals');
  //       console.log(monthVocalQuestion);
  //   }
  // );

  it("Should contain correct italian month in title for month-vocals question", async () => {
    const currentMonth = new Date().getMonth();
    const italianMonth = italianMonths[currentMonth];
    const response = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");

    const monthVocalQuestion = response.body.questions?.find(
      (question: { slug: string }) => question.slug === "month-vocals"
    );
    expect(monthVocalQuestion.title).toEqual(
      expect.stringContaining(italianMonth)
    );
  });
});
