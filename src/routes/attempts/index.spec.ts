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
    expect(response.body.length).toBe(3);
    const today = new Date().toISOString().split("T")[0];
    expect(response.body).toEqual([
      {
        id: 1,
        date: today,
        time: "10",
        code: "+asd123",
        errors: 0,
      },
      {
        id: 2,
        date: today,
        time: "10",
        code: "+asd123",
        errors: 4,
      },
      {
        id: 3,
        date: today,
        time: "0",
        code: "+asd123",
        errors: 0,
      },
    ]);
  });
});
