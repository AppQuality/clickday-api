import app from "@src/app";
import { clickDay } from "@src/features/database";
import request from "supertest";

const body: StoplightOperations["post-attempts-id"]["requestBody"]["content"]["application/json"] =
  [
    { slug: "email", answer: "a" },
    { slug: "bando", answer: "b" },
    { slug: "last-numbers-bando", answer: "a" },
    { slug: "month-vocals", answer: "a" },
    { slug: "amount", answer: "a" },
    { slug: "axis", answer: "a" },
    { slug: "moment-date", answer: "a" },
    { slug: "today", answer: "a" },
    { slug: "first-characters", answer: "abc" },
  ];

const wrongSlugInBody = [
  { slug: "email", answer: "" },
  { slug: "bando", answer: "" },
  { slug: "last-numbers-bando", answer: "" },
  { slug: "month-vocals", answer: "" },
  { slug: "amount", answer: "" },
  { slug: "axis", answer: "" },
  { slug: "moment-date", answer: "" },
  { slug: "today", answer: "" },
  { slug: "not-allowed-slug", answer: "" },
];
describe("POST /attempts/:id", () => {
  afterEach(async () => {
    await clickDay.tables.CdAttempts.do().delete();
    await clickDay.tables.CdAttemptsQuestions.do().delete();
  });
  it("Should answer 400 if request body length is not 9", async () => {
    const response = await request(app)
      .post("/attempts/1")
      .set("authorization", "Bearer tester")
      .send([{ slug: "email", answer: "gino.porfilio@tryber.me" }]);
    expect(response.status).toBe(400);
  });

  it("Should answer 400 if request body send an item with a not allowed slug", async () => {
    const response = await request(app)
      .post("/attempts/1")
      .set("authorization", "Bearer tester")
      .send(wrongSlugInBody);
    expect(response.status).toBe(400);
  });

  it("Should answer 403 if not logged in", async () => {
    const response = await request(app).post("/attempts/1");
    expect(response.status).toBe(403);
  });

  it("Should return 403 if the attempt is already completed", async () => {
    const id = await clickDay.tables.CdAttempts.do().insert({
      agency_code: "+31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      start_time: "2023-04-19 09:16:34",
      end_time: "2023-04-19 09:17:34",
      errors: 0,
      tester_id: 1,
    });
    const response = await request(app)
      .post(`/attempts/${id}`)
      .send(body)
      .set("authorization", "Bearer tester");

    expect(response.status).toBe(403);
  });

  it("Should answer 404 if attempId does not exist", async () => {
    const response = await request(app)
      .post("/attempts/99999")
      .send(body)
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(404);
  });

  it("Should answer 200 if logged in", async () => {
    const {
      body: { id },
    } = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");
    const response = await request(app)
      .post(`/attempts/${id}`)
      .send(body)
      .set("authorization", "Bearer tester");

    expect(response.status).toBe(200);
  });

  it("Should return the elapsedTime", async () => {
    const responseStart = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");
    const responseEnd = await request(app)
      .post(`/attempts/${responseStart.body.id}`)
      .send(body)
      .set("authorization", "Bearer tester");
    expect(responseEnd.body.elapsedTime).toBeGreaterThan(0);
    const res = await clickDay.tables.CdAttempts.do()
      .select("end_time", "start_time")
      .where({ id: responseStart.body.id })
      .first();
    if (res && res.end_time && res.start_time) {
      const checkElapsedTime =
        new Date(res?.end_time).getTime() - new Date(res?.start_time).getTime();
      expect(checkElapsedTime).toEqual(responseEnd.body.elapsedTime);
    }
  });

  it("Should update end_date for the attempt", async () => {
    const id = await clickDay.tables.CdAttempts.do().insert({
      agency_code: "+31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      start_time: "2023-04-19 09:16:34",
      tester_id: 1,
    });
    await request(app)
      .post(`/attempts/${id[0]}`)
      .send(body)
      .set("authorization", "Bearer tester");
    const res = await clickDay.tables.CdAttempts.do()
      .select("end_time")
      .where({ id: id[0] })
      .first();
    expect(res?.end_time).not.toBeNull();
  });

  //Should return correct answer for email question
  it("Should return wrong answer for email when send wrong data", async () => {
    const responseStart = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");
    //get correct answer for email question
    const result = await clickDay.tables.CdAttemptsQuestions.do()
      .select("correct_answer")
      .where({ attempt_id: responseStart.body.id, type: "email" })
      .first();
    const correctAnswer = result?.correct_answer;
    const responseBody = body;
    responseBody[0].answer = "";
    const responseEnd = await request(app)
      .post(`/attempts/${responseStart.body.id}`)
      .send(responseBody)
      .set("authorization", "Bearer tester");
    expect(responseEnd.body.success).toBe(false);
    expect(responseEnd.body.wrongAnswers).toBeDefined();
    expect(responseEnd.body.wrongAnswers[0].slug).toBe("email");
    expect(responseEnd.body.wrongAnswers[0].yourAnswer).toBe("");
    expect(responseEnd.body.wrongAnswers[0].correctAnswer).toBe(correctAnswer);
  });

  //Should return correct answer for bando question
  //Should return correct answer for last-numbers-bando question
  //Should return correct answer for month-vocals question
  //Should return correct answer for amount question
  //Should return correct answer for axis question
  //Should return correct answer for moment-date question
  //Should return correct answer for today question
  //Should return correct answer for tomorrow question
  //Should return correct answer for yesterday question
  //Should return correct answer for first-characters question
  //Should return correct answer for last-characters question
  //Should return correct answer for first-numbers question
  //Should return correct answer for last-numbers question
});
