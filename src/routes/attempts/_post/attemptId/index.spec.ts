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
  it("Should answer 403 if not logged in", async () => {
    const response = await request(app).post("/attempts/1");
    expect(response.status).toBe(403);
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
});
