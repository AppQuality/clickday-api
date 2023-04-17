import app from "@src/app";
import { clickDay } from "@src/features/database";
import request from "supertest";

describe("GET /users/me", () => {
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
      .send({ code: "123" })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
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

  it("Should generate one email question on a new attempt", async () => {
    const response = await request(app)
      .post("/attempts")
      .send({ code: "+123" })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const question = await clickDay.tables.CdAttemptsQuestions.do().select();
    expect(question.length).toBe(1);
    expect(question[0].type).toBe("email");
    console.log(response.body.questions);
  });
});
