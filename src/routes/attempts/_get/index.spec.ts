import app from "@src/app";
import { clickDay } from "@src/features/database";
import request from "supertest";

describe("GET /attempts tester has no attempts", () => {
  it("Should return 403 if logged out", async () => {
    const response = await request(app).get("/attempts");
    expect(response.status).toBe(403);
  });
  it("Should answer 200 if logged in", async () => {
    const response = await request(app)
      .get("/attempts")
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
  });
  it("Should return empty array when there are no data", async () => {
    const response = await request(app)
      .get("/attempts")
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("GET /attempts", () => {
  beforeAll(async () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(0, 0, 0, 10);
    await clickDay.tables.CdAttempts.do().insert([
      {
        id: 1,
        tester_id: 1,
        agency_code: "+asd123",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        errors: 0,
      },
      {
        id: 2,
        tester_id: 1,
        agency_code: "+asd123",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        errors: 4,
      },
      {
        id: 3,
        tester_id: 1,
        agency_code: "+asd123",
        start_time: start.toISOString(),
      },
      {
        id: 4,
        tester_id: 123,
        agency_code: "-asd123",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        errors: 0,
      },
    ]);
  });

  it("Should return tester attempts", async () => {
    const response = await request(app)
      .get("/attempts")
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    const today = new Date();
    const todayString = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    expect(response.body).toEqual([
      {
        id: 1,
        date: todayString,
        time: "10",
        code: "+asd123",
        errors: 0,
      },
      {
        id: 2,
        date: todayString,
        time: "10",
        code: "+asd123",
        errors: 4,
      },
    ]);
  });
  it("Should return just attempts with end_date", async () => {
    const attempts = await clickDay.tables.CdAttempts.do()
      .select()
      .where({ tester_id: 1 });
    const comletedAttempts = attempts.filter(
      (attempt) => attempt.end_time !== null
    );

    const response = await request(app)
      .get("/attempts")
      .set("authorization", "Bearer tester");
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(comletedAttempts.length);
    const today = new Date();
    const todayString = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    expect(response.body.length).not.toEqual(attempts.length);
    expect(response.body).toEqual([
      {
        id: 1,
        date: todayString,
        time: "10",
        code: "+asd123",
        errors: 0,
      },
      {
        id: 2,
        date: todayString,
        time: "10",
        code: "+asd123",
        errors: 4,
      },
    ]);
  });
});
