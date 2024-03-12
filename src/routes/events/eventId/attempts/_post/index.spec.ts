import app from "@src/app";
import { clickDay } from "@src/features/database";
import e from "cors";
import request from "supertest";

const event_1 = {
  id: 100,
};

const attempt_1 = {
  id: 100,
  tester_id: 0,
  agency_code:
    "-f837a92059794c91a4ac452031ca2ca891ab5da4cf964a6b87f3811eb6ea8855",
};

const event_to_attempt_1 = {
  event_id: event_1.id,
  attempt_id: attempt_1.id,
  is_blueprint: 1,
};

const attempt_questions_1 = [
  {
    attempt_id: attempt_1.id,
    type: "email",
    title: "Seleziona l'indirizzo email del partecipante",
    input_type: "dropdown",
    options: ["a@tryber.me", "b@tryber.me", "c@tryber.me"],
    correct_answer: "a@tryber.me",
  },
  {
    attempt_id: attempt_1.id,
    type: "bando",
    title: "Seleziona il bando al quale stai partecipando",
    input_type: "dropdown",
    options: ["Bando 1", "Bando 2", "Bando 3"],
    correct_answer: "Bando 2",
  },
  {
    attempt_id: attempt_1.id,
    type: "last-numbers-bando",
    title: "Seleziona le ultime 2 cifre del bando",
    input_type: "dropdown",
    options: ["18", "19", "20", "21", "22", "23"],
    correct_answer: "18",
  },
  {
    attempt_id: attempt_1.id,
    type: "amount",
    title: "Seleziona l'importo dello stanziamento del bando",
    input_type: "dropdown",
    options: [
      "1200€",
      "2901€",
      "3989€",
      "4345€",
      "5986€",
      "6969€",
      "7102€",
      "8983€",
      "9999€",
    ],
    correct_answer: "1200€",
  },
  {
    attempt_id: attempt_1.id,
    type: "axis",
    title: "Seleziona il numero degli assi di finanziamento",
    input_type: "dropdown",
    options: ["123", "456", "789", "012", "412", "892", "690", "456"],
    correct_answer: "123",
  },
  {
    attempt_id: attempt_1.id,
    type: "moment-date",
    title: "Seleziona la data del momento",
    input_type: "dropdown",
    options: [
      "Momento 1 : 26/10/2021",
      "Momento 2 : 12/12/2022",
      "Momento 3 : 26/12/2021",
      "Momento 4 : 26/09/2019",
      "Momento 5 : 26/10/2021",
      "Momento 6 : 12/12/2022",
      "Momento 7 : 13/12/2018",
      "Momento 8 : 26/09/2019",
      "Momento 9 : 26/10/2021",
    ],
    correct_answer: "Momento 1 : 26/10/2021",
  },
  {
    attempt_id: attempt_1.id,
    type: "today",
    title: "Inserisci la data di oggi nel formato gg/mm/aaaa",
    input_type: "text",
    correct_answer: new Date().toISOString().split("T")[0],
  },
  {
    attempt_id: attempt_1.id,
    type: "yesterday",
    title: "Inserisci la data di ieri nel formato gg/mm/aaaa",
    input_type: "text",
    correct_answer: new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .split("T")[0],
  },
  {
    attempt_id: attempt_1.id,
    type: "month-vocals",
    title: "Seleziona le vocali del mese (Novembre)",
    input_type: "dropdown",
    options: [
      "aeio",
      "aeio",
      "ao",
      "aie",
      "aio",
      "iuo",
      "uio",
      "ao",
      "eee",
      "ooe",
      "oee",
      "iee",
    ],
    correct_answer: "iee",
  },
];

describe("POST /events/{id}/attempt", () => {
  const start = new Date();
  const end = new Date();
  const expired = new Date();
  const startAfter = new Date();
  start.setDate(start.getDate() - 2);
  end.setDate(end.getDate() + 1);
  expired.setDate(expired.getDate() - 10);
  startAfter.setDate(startAfter.getDate() - 1);

  beforeEach(async () => {
    await clickDay.tables.CdEvents.do().insert({
      ...event_1,
      title: "Event available 1",
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    });

    await clickDay.tables.CdAttempts.do().insert({
      ...attempt_1,
    });

    await clickDay.tables.CdEventsToAttempts.do().insert({
      ...event_to_attempt_1,
    });

    for (const question of attempt_questions_1) {
      await clickDay.tables.CdAttemptsQuestions.do().insert({
        ...question,
        options: question.options ? question.options.join(",") : undefined,
      });
    }
  });

  afterEach(async () => {
    await clickDay.tables.CdEvents.do().delete();
    await clickDay.tables.CdAttempts.do().delete();
    await clickDay.tables.CdEventsToAttempts.do().delete();
    await clickDay.tables.CdAttemptsQuestions.do().delete();
  });

  it("Should answer 403 if not logged in", async () => {
    const response = await request(app).post(`/events/${event_1.id}/attempt`);
    expect(response.status).toBe(403);
  });

  it("Should answer 400 if event doesn't exist", async () => {
    const response = await request(app)
      .post(`/events/999/attempt`)
      .set("Authorization", "Bearer tester");
    expect(response.status).toBe(400);
  });

  it("Should answer 400 if path parameter is invalid", async () => {
    const response = await request(app)
      .post(`/events/invalid/attempt`)
      .set("Authorization", "Bearer tester");
    expect(response.status).toBe(400);
  });

  it("Should answer 200 if logged in", async () => {
    const response = await request(app)
      .post(`/events/${event_1.id}/attempt`)
      .set("Authorization", "Bearer tester");
    expect(response.status).toBe(200);
  });

  it("Should create an attempt connected to the event with is_blueprint = 0 with all its questions", async () => {
    const response = await request(app)
      .post(`/events/${event_1.id}/attempt`)
      .set("Authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const eventToAttempt = await clickDay.tables.CdEventsToAttempts.do()
      .select()
      .where({
        event_id: event_1.id,
        attempt_id: response.body.id,
        is_blueprint: 0,
      })
      .first();
    expect(eventToAttempt).toBeTruthy();
    const eventAttemptQuestions = await clickDay.tables.CdAttemptsQuestions.do()
      .select()
      .where({ attempt_id: response.body.id });
    expect(eventAttemptQuestions).toHaveLength(9);
  });

  it("Should return the attempt id, the start time and the questions of the event blueprint attempt", async () => {
    const response = await request(app)
      .post(`/events/${event_1.id}/attempt`)
      .set("Authorization", "Bearer tester");
    expect(response.status).toBe(200);
    const eventAttempt = await clickDay.tables.CdEventsToAttempts.do()
      .select()
      .where({ event_id: event_1.id, is_blueprint: 1 })
      .first();
    const eventAttemptQuestions = await clickDay.tables.CdAttemptsQuestions.do()
      .select()
      .where({ attempt_id: eventAttempt?.attempt_id });
    expect(response.body).toEqual(
      expect.objectContaining({
        startTime: start.toISOString(),
        questions: eventAttemptQuestions.map((question) => {
          if (question.input_type === "dropdown") {
            return {
              title: question.title,
              type: question.input_type as "dropdown",
              slug: question.type,
              options: question.options.split(","),
            };
          } else {
            return {
              title: question.title,
              type: question.input_type as "text",
              slug: question.type,
            };
          }
        }),
      })
    );
  });

  it("Shouldn't be possibile to create an attempt if the event is expired", async () => {
    await clickDay.tables.CdEvents.do().delete();
    await clickDay.tables.CdAttempts.do().delete();
    await clickDay.tables.CdEventsToAttempts.do().delete();
    await clickDay.tables.CdAttemptsQuestions.do().delete();

    await clickDay.tables.CdEvents.do().insert({
      id: 101,
      title: "Event expired 1",
      start_date: expired.toISOString(),
      end_date: startAfter.toISOString(),
    });

    await clickDay.tables.CdAttempts.do().insert({
      id: 101,
      tester_id: 0,
      agency_code:
        "-f837a92059794c91a4ac452031ca2ca891ab5da4cf964a6b87f3811eb6ea8855",
    });

    for (const question of attempt_questions_1) {
      await clickDay.tables.CdAttemptsQuestions.do().insert({
        ...question,
        attempt_id: 101,
        options: question.options ? question.options.join(",") : undefined,
      });
    }

    await clickDay.tables.CdEventsToAttempts.do().insert({
      event_id: 101,
      attempt_id: 101,
      is_blueprint: 1,
    });

    const response = await request(app)
      .post(`/events/101/attempt`)
      .set("Authorization", "Bearer tester");

    expect(response.status).toBe(400);
  });

  it("Shouldn't be possibile to create an attempt if the event is not started yet", async () => {
    await clickDay.tables.CdEvents.do().delete();
    await clickDay.tables.CdAttempts.do().delete();
    await clickDay.tables.CdEventsToAttempts.do().delete();
    await clickDay.tables.CdAttemptsQuestions.do().delete();

    await clickDay.tables.CdEvents.do().insert({
      id: 102,
      title: "Event not started 1",
      start_date: end.toISOString(),
      end_date: end.toISOString(),
    });

    await clickDay.tables.CdAttempts.do().insert({
      id: 102,
      tester_id: 0,
      agency_code:
        "-f837a92059794c91a4ac452031ca2ca891ab5da4cf964a6b87f3811eb6ea8855",
    });

    for (const question of attempt_questions_1) {
      await clickDay.tables.CdAttemptsQuestions.do().insert({
        ...question,
        attempt_id: 102,
        options: question.options ? question.options.join(",") : undefined,
      });
    }

    await clickDay.tables.CdEventsToAttempts.do().insert({
      event_id: 102,
      attempt_id: 102,
      is_blueprint: 1,
    });

    const response = await request(app)
      .post(`/events/102/attempt`)
      .set("Authorization", "Bearer tester");

    expect(response.status).toBe(400);
  });

  //
  it("Shouldn't be possibile to create an attempt if the event doesn't exist", async () => {
    const response = await request(app)
      .post(`/events/99999/attempt`)
      .set("Authorization", "Bearer tester");

    expect(response.status).toBe(400);
  });

  it("Shouldn't be possibile to create an attempt if the event id path param is invalid", async () => {
    const response = await request(app)
      .post(`/events/asd/attempt`)
      .set("Authorization", "Bearer tester");

    expect(response.status).toBe(400);
  });
  it("Should answer 403 if the user has already attempted the event", async () => {
    await clickDay.tables.CdAttempts.do().insert({
      agency_code: attempt_1.agency_code,
      tester_id: 1,
      start_time: start.toISOString(),
    });
    const attempt = await clickDay.tables.CdAttempts.do()
      .select("id", "start_time")
      .where({
        agency_code: attempt_1.agency_code,
        tester_id: 1,
      })
      .orderBy("id", "desc")
      .first();
    await clickDay.tables.CdEventsToAttempts.do().insert({
      event_id: event_1.id,
      attempt_id: attempt?.id,
      is_blueprint: 0,
    });
    const response = await request(app)
      .post(`/events/${event_1.id}/attempt`)
      .set("Authorization", "Bearer tester");
    expect(response.status).toBe(403);
  });
});
