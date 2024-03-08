import app from "@src/app";
import { clickDay } from "@src/features/database";
import request from "supertest";

describe("GET /events", () => {
  const start = new Date();
  const end = new Date();
  const expired = new Date();
  const startAfter = new Date();
  start.setDate(start.getDate() - 2);
  end.setDate(end.getDate() + 1);
  expired.setDate(expired.getDate() - 10);
  startAfter.setDate(startAfter.getDate() - 1);

  beforeAll(async () => {
    await clickDay.tables.CdEvents.do().insert({
      title: "Event available 1",
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    });

    await clickDay.tables.CdEvents.do().insert({
      title: "Event available 2",
      start_date: startAfter.toISOString(),
      end_date: end.toISOString(),
    });

    await clickDay.tables.CdEvents.do().insert({
      title: "Event expired",
      start_date: expired.toISOString(),
      end_date: start.toISOString(),
    });
  });

  afterAll(async () => {
    await clickDay.tables.CdEvents.do().delete();
  });

  it("Should answer 403 if not logged in", async () => {
    const response = await request(app).get("/events");
    expect(response.status).toBe(403);
  });

  it("Should answer 200 if logged in", async () => {
    const response = await request(app)
      .get("/events")
      .set("Authorization", "Bearer tester");
    expect(response.status).toBe(200);
  });

  it("Should return 404 if no event is found", async () => {
    await clickDay.tables.CdEvents.do().delete();

    const response = await request(app)
      .get("/events")
      .set("Authorization", "Bearer tester");
    expect(response.status).toBe(404);
  });

  it("Should return 404 if the event is expired and no other event is available", async () => {
    await clickDay.tables.CdEvents.do().delete();

    await clickDay.tables.CdEvents.do().insert({
      title: "Event expired",
      start_date: expired.toISOString(),
      end_date: start.toISOString(),
    });

    const response = await request(app)
      .get("/events")
      .set("Authorization", "Bearer tester");
    expect(response.status).toBe(404);
  });

  it("Should return the first available event", async () => {
    const response = await request(app)
      .get("/events")
      .set("Authorization", "Bearer tester");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: "Event available 1",
      })
    );
  });

  it("Should return the next available event if the current event is expired and the start_date of the next event is > now", async () => {
    await clickDay.tables.CdEvents.do().delete();

    await clickDay.tables.CdEvents.do().insert({
      title: "Event expired",
      start_date: expired.toISOString(),
      end_date: start.toISOString(),
    });

    await clickDay.tables.CdEvents.do().insert({
      title: "Event available 2",
      start_date: startAfter.toISOString(),
      end_date: end.toISOString(),
    });

    const response = await request(app)
      .get("/events")
      .set("Authorization", "Bearer tester");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: "Event available 2",
      })
    );
  });
});
