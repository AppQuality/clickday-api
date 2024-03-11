import app from "@src/app";
import { clickDay } from "@src/features/database";
import request from "supertest";

const test_1 = {
  id: 1,
  title: "Test 1",
  start_date: "2021-08-01T00:00:00.000Z",
  end_date: "2021-09-01T00:00:00.000Z",
  creation_date: "2021-08-01T00:00:00.000Z",
};

describe("POST /events", () => {
  beforeAll(async () => {
    await clickDay.tables.CdEvents.do().insert(test_1);
  });
  afterAll(async () => {
    await clickDay.tables.CdEvents.do().delete();
  });

  it("Should answer 403 if not logged in", async () => {
    const response = await request(app).post("/events");
    expect(response.status).toBe(403);
  });

  it("Should answer 200 if logged in", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        title: "new title",
        start_date: "2021-08-01T00:00:00.000Z",
        end_date: "2021-09-01T00:00:00.000Z",
      })
      .set("authorization", "Bearer admin");
    expect(response.status).toBe(200);
  });

  it("Should answer 400 if the body is empty", async () => {
    const response = await request(app)
      .post("/events")
      .send({})
      .set("authorization", "Bearer admin");
    expect(response.status).toBe(400);
  });

  it("Should answer 400 if the title already exists", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        title: "Test 1",
        start_date: "2021-08-01T00:00:00.000Z",
        end_date: "2021-09-01T00:00:00.000Z",
      })
      .set("authorization", "Bearer admin");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Event already exists");
  });

  it("Should answer 400 if the title is invalid", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        title: 123,
        start_date: "2021-08-01T00:00:00.000Z",
        end_date: "2021-09-01T00:00:00.000Z",
      })
      .set("authorization", "Bearer admin");
    expect(response.status).toBe(400);
  });

  it("Should answer 400 if the title is missing", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        start_date: "2021-08-01T00:00:00.000Z",
        end_date: "2021-09-01T00:00:00.000Z",
      })
      .set("authorization", "Bearer admin");
    expect(response.status).toBe(400);
  });

  it("Should answer 400 if the start_time is missing", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        title: "new title",
        end: "2021-08-01T00:00:00.000Z",
      })
      .set("authorization", "Bearer admin");
    expect(response.status).toBe(400);
  });

  it("Should answer 400 if the end_time is missing", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        title: "new title",
        start: "2021-08-01T00:00:00.000Z",
      })
      .set("authorization", "Bearer admin");
    expect(response.status).toBe(400);
  });

  it("Should answer 400 if the end time is before the start time", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        title: "new title",
        start_date: "2021-08-01T00:00:00.000Z",
        end_date: "2021-07-01T00:00:00.000Z",
      })
      .set("authorization", "Bearer admin");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "The start date must be before the end date"
    );
  });

  it("Should insert a new event on success", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        title: "New Title 2",
        start_date: "2021-08-01T00:00:00.000Z",
        end_date: "2021-09-01T00:00:00.000Z",
      })
      .set("authorization", "Bearer admin");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ title: "New Title 2" })
    );
    const event = await clickDay.tables.CdEvents.do().select().where({
      title: "New Title 2",
    });
    expect(event.length).toBe(1);
  });

  it("Should create an attempt and assign it to the event on creation", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        title: "TestTitle 2",
        start_date: "2021-08-01T00:00:00.000Z",
        end_date: "2021-09-01T00:00:00.000Z",
      })
      .set("authorization", "Bearer admin");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ title: "TestTitle 2" })
    );
    const event = await clickDay.tables.CdEvents.do().select().where({
      title: "TestTitle 2",
    });
    expect(event.length).toBe(1);
    const eventToAttempt = await clickDay.tables.CdEventsToAttempts.do()
      .select()
      .where("event_id", response.body.id);
    expect(eventToAttempt.length).toBe(1);
    expect(eventToAttempt[0].is_blueprint).toBe(1);
    const attempt = await clickDay.tables.CdAttempts.do().select().where({
      id: eventToAttempt[0].attempt_id,
    });
    expect(attempt.length).toBe(1);
    const questions = await clickDay.tables.CdAttemptsQuestions.do()
      .select()
      .where("attempt_id", attempt[0].id);
    expect(questions.length).toBe(9);
  });

  it("Should have all the expected question fields", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        title: "Test icolo 2",
        start_date: "2021-08-01T00:00:00.000Z",
        end_date: "2021-09-01T00:00:00.000Z",
      })
      .set("authorization", "Bearer admin");
    expect(response.status).toBe(200);
    const eventToAttempt = await clickDay.tables.CdEventsToAttempts.do()
      .select()
      .where("event_id", response.body.id);
    const attempt = await clickDay.tables.CdAttempts.do().select().where({
      id: eventToAttempt[0].attempt_id,
    });
    const questions = await clickDay.tables.CdAttemptsQuestions.do()
      .select()
      .where("attempt_id", attempt[0].id);
    for (const question of questions) {
      expect(question.title).toBeDefined();
      expect(question.type).toBeDefined();
      expect(question.correct_answer).toBeDefined();
      if (question.input_type === "dropdown") {
        expect(question.options).toBeDefined();
      }
    }
  });

  it("Should fail if the user is not an administator", async () => {
    const response = await request(app)
      .post("/events")
      .send({
        title: "New Title 2",
        start_date: "2021-08-01T00:00:00.000Z",
        end_date: "2021-09-01T00:00:00.000Z",
      })
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(403);
  });
});
