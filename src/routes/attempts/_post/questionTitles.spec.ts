import app from "@src/app";
import { clickDay } from "@src/features/database";
import request from "supertest";

describe("POST /attempts questions titles", () => {
  afterEach(async () => {
    await clickDay.tables.CdAttempts.do().delete();
    await clickDay.tables.CdAttemptsQuestions.do().delete();
    jest.resetAllMocks();
  });

  const questionTypesWithAnswers = [
    "email",
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

  it("Should contain correct answer in title for first/last - character/numbers question", async () => {
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
    const responseQuestion = response.body.questions.filter(
      (q: { title: string; slug: string }) => q.slug == questionType
    );
    expect(responseQuestion).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: questionType,
          title: expect.stringContaining(question.correct_answer),
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

  test.each(
    [
      { month: "Gennaio", monthNumber: "01" },
      { month: "Febbraio", monthNumber: "02" },
      { month: "Marzo", monthNumber: "03" },
      { month: "Aprile", monthNumber: "04" },
      { month: "Maggio", monthNumber: "05" },
      { month: "Giugno", monthNumber: "06" },
      { month: "Luglio", monthNumber: "07" },
      { month: "Agosto", monthNumber: "08" },
      { month: "Settembre", monthNumber: "09" },
      { month: "Ottobre", monthNumber: "10" },
      { month: "Novembre", monthNumber: "11" },
      { month: "Dicembre", monthNumber: "12" },
    ].map((item) =>
      Object.assign(item, {
        toString: function () {
          return (this as { month: string }).month;
        },
      })
    )
  )("Should contain %s in question month vocals", async (currentMonth) => {
    const monthNumber = (currentMonth as { monthNumber: string }).monthNumber;

    jest.useFakeTimers().setSystemTime(new Date(`2020-${monthNumber}-01`));
    const response = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");

    expect(response.body.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: "month-vocals",
          title: expect.stringContaining(currentMonth.toString()),
        }),
      ])
    );
  });
});
