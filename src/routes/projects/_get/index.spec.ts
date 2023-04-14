import app from "@src/app";
import request from "supertest";

const project1 = {
  id: 1,
  name: "Project 1",
  description: "Description 1",
};

const project2 = {
  id: 2,
  name: "Project 2",
  description: "Description 2",
};

const project3 = {
  id: 3,
  name: "Project 3",
  description: "Description 3",
};

describe("Route GET /projects", () => {
  beforeAll(async () => {});
  afterAll(async () => {});

  it("Should answer 403 if not logged in", async () => {
    const response = await request(app).get("/projects");
    expect(response.status).toBe(403);
  });

  it("Should answer 200 if logged in", async () => {
    const response = await request(app)
      .get("/projects")
      .set("authorization", "Bearer tester");
    expect(response.status).toBe(200);
  });

  it("Should answer with a list of projects on success", async () => {
    const response = await request(app)
      .get("/projects")
      .set("authorization", "Bearer tester");
    expect(response.body).toMatchObject({
      items: [
        {
          id: project1.id,
          name: project1.name,
          description: project1.description,
        },
        {
          id: project2.id,
          name: project2.name,
          description: project2.description,
        },
        {
          id: project3.id,
          name: project3.name,
          description: project3.description,
        },
      ],
    });
  });
});
