import app from "@src/app";
import { clickDay } from "@src/features/database";
import request from "supertest";

describe("POST /attempts", () => {
  afterEach(async () => {
    await clickDay.tables.CdAttempts.do().delete();
    await clickDay.tables.CdAttemptsQuestions.do().delete();
  });
  it("Should answer 403 if not logged in", async () => {
    const response = await request(app).post("/attempts");
    expect(response.status).toBe(403);
  });

  it("Should answer 200 if logged in", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "+123" })
      .set("authorization", "Bearer tester");
    console.info(response.body.questions);
    expect(response.status).toBe(200);
  });

  it("Should answer 400 if code is not sent", async () => {
    const response = await request(app)
      .post("/attempts")
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(400);
  });

  it("Should answer 400 if code doesn't start with a sign +/-", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "123" })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(400);
  });

  it("Should insert a new attempt on success", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "+123" })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const attempts = await clickDay.tables.CdAttempts.do().select();
    expect(attempts.length).toBe(1);
    expect(attempts[0].agency_code).toBe("+123");
    expect(attempts[0].tester_id).toBe(1);
  });

  it("Should return the current date of the attempt", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "+123" })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const attempts = await clickDay.tables.CdAttempts.do().select();
    expect(attempts.length).toBe(1);
    expect(attempts[0].start_time).toBeNow(10);
  });

  it("Should generate one email question on a new attempt", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "+123" })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const question = await clickDay.tables.CdAttemptsQuestions.do().select();
    expect(question).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "email",
        }),
      ])
    );
  });

  it("Should generate one month-vocals question on a new attempt", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "+123" })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const question = await clickDay.tables.CdAttemptsQuestions.do().select();
    expect(question).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "month-vocals",
        }),
      ])
    );
  });

  it("Should generate one bando question on a new attempt", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "+123" })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const question = await clickDay.tables.CdAttemptsQuestions.do().select();
    expect(question).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "bando",
        }),
      ])
    );
  });

  it("Should generate one last-numbers-bando question on a new attempt", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "+123" })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const question = await clickDay.tables.CdAttemptsQuestions.do().select();
    expect(question).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "last-numbers-bando",
        }),
      ])
    );
  });

  it("Should generate one amount question on a new attempt", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "+123" })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const question = await clickDay.tables.CdAttemptsQuestions.do().select();
    expect(question).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "amount",
        }),
      ])
    );
  });

  it("Should generate one axis question on a new attempt", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "+123" })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const question = await clickDay.tables.CdAttemptsQuestions.do().select();
    expect(question).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "axis",
        }),
      ])
    );
  });

  it("Should generate one date question on a new attempt", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "+123" })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const question = await clickDay.tables.CdAttemptsQuestions.do().select();
    expect(question).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: expect.stringMatching(/^(today|tomorrow|yesterday)$/),
        }),
      ])
    );
  });

  it("Should generate one moment-date question on a new attempt", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "+123" })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const question = await clickDay.tables.CdAttemptsQuestions.do().select();
    expect(question).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "moment-date",
        }),
      ])
    );
  });

  it("Should generate one code question on a new attempt", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const question = await clickDay.tables.CdAttemptsQuestions.do().select();
    expect(question).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: expect.stringMatching(
            /^(first-characters|first-numbers|last-characters|last-numbers)$/
          ),
        }),
      ])
    );
  });

  // Should retrieve one question of each type on a new attempt
  it("Should retrieve one question of each type on a new attempt", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "+123" })
      .set("authorization", "Bearer tester");

    expect(response.status).toBe(200);

    expect(response.body.questions).toBeDefined();
    expect(response.body.questions).toBeInstanceOf(Array);
    expect(response.body.questions).toHaveLength(9); // Should be 9 questions in total

    expect(response.body.questions).toEqual([
      expect.objectContaining({
        slug: "email",
      }),
      expect.objectContaining({
        slug: "month-vocals",
      }),
      expect.objectContaining({
        slug: "bando",
      }),
      expect.objectContaining({
        slug: "last-numbers-bando",
      }),
      expect.objectContaining({
        slug: "amount",
      }),
      expect.objectContaining({
        slug: "axis",
      }),
      expect.objectContaining({
        slug: "moment-date",
      }),
      expect.objectContaining({
        slug: expect.stringMatching(/^(today|tomorrow|yesterday)$/),
      }),
      expect.objectContaining({
        slug: expect.stringMatching(
          /^(first-characters|first-numbers|last-characters|last-numbers)$/
        ),
      }),
    ]);
  });
});
