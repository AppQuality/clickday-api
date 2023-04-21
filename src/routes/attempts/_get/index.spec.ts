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
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const endToday = new Date();
    endToday.setHours(0, 0, 0, 10);
    const startYesterday = new Date();
    startYesterday.setDate(startYesterday.getDate() - 1);
    startYesterday.setHours(0, 0, 0, 0);
    const endYesterday = new Date();
    endYesterday.setDate(endYesterday.getDate() - 1);
    endYesterday.setHours(0, 0, 0, 10);
    await clickDay.tables.CdAttempts.do().insert([
      {
        id: 1,
        tester_id: 1,
        agency_code: "+asd123",
        start_time: startYesterday.toISOString(),
        end_time: endYesterday.toISOString(),
        errors: 0,
      },
      {
        id: 2,
        tester_id: 1,
        agency_code: "+asd123",
        start_time: startToday.toISOString(),
        end_time: endToday.toISOString(),
        errors: 4,
      },
      {
        id: 3,
        tester_id: 1,
        agency_code: "+asd123",
        start_time: startToday.toISOString(),
      },
      {
        id: 4,
        tester_id: 123,
        agency_code: "-asd123",
        start_time: startToday.toISOString(),
        end_time: endToday.toISOString(),
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
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = `${yesterday.getFullYear()}-${
      yesterday.getMonth() + 1
    }-${yesterday.getDate()}`;

    expect(response.body).toEqual([
      {
        id: 2,
        date: todayString,
        time: "10",
        code: "+asd123",
        errors: 4,
      },
      {
        id: 1,
        date: yesterdayString,
        time: "10",
        code: "+asd123",
        errors: 0,
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
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(comletedAttempts.length);
    const today = new Date();
    const todayString = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = `${yesterday.getFullYear()}-${
      yesterday.getMonth() + 1
    }-${yesterday.getDate()}`;
    expect(response.body.length).not.toEqual(attempts.length);
    expect(response.body).toEqual([
      {
        id: 2,
        date: todayString,
        time: "10",
        code: "+asd123",
        errors: 4,
      },
      {
        id: 1,
        date: yesterdayString,
        time: "10",
        code: "+asd123",
        errors: 0,
      },
    ]);
  });

  //Should return attempts ordered by start_date desc
  it("Should return attempts ordered by start_date desc", async () => {
    const response = await request(app)
      .get("/attempts")
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].id).toBe(2);
    expect(response.body[1].id).toBe(1);
  });
});
