import app from "@src/app";
import { clickDay } from "@src/features/database";
import request from "supertest";

const body: StoplightOperations["post-attempts-id"]["requestBody"]["content"]["application/json"] =
  [
    { slug: "email", answer: "a" },
    { slug: "bando", answer: "a" },
    { slug: "last-numbers-bando", answer: "a" },
    { slug: "month-vocals", answer: "a" },
    { slug: "amount", answer: "a" },
    { slug: "axis", answer: "a" },
    { slug: "moment-date", answer: "a" },
    { slug: "today", answer: "a" },
    { slug: "first-characters", answer: "a" },
  ];

describe("POST /attempts/:id", () => {
  afterEach(async () => {
    await clickDay.tables.CdAttempts.do().delete();
    await clickDay.tables.CdAttemptsQuestions.do().delete();
  });
  it("Should answer 400 if request body length is not 9", async () => {
    const responseStart = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");
    const response = await request(app)
      .post("/attempts/" + responseStart.body.id)
      .set("authorization", "Bearer tester")
      .send([{ slug: "email", answer: "gino.porfilio@tryber.me" }]);
    expect(response.status).toBe(400);
  });

  it("Should answer 400 if request body send an item with a not allowed slug", async () => {
    // Set wrong slug in body
    const wrongSlugInBody = body.map((item) => {
      if (item.slug === "email") {
        return { ...item, slug: "wrong-slug" };
      }
      return item;
    });

    const response = await request(app)
      .post("/attempts/1")
      .set("authorization", "Bearer tester")
      .send(wrongSlugInBody);
    expect(response.status).toBe(400);
  });

  it("Should answer 403 if not logged in", async () => {
    const response = await request(app).post("/attempts/1");
    expect(response.status).toBe(403);
  });

  it("Should return 200 if the attempt is already completed", async () => {
    const id = await clickDay.tables.CdAttempts.do().insert({
      agency_code: "+31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      start_time: "2023-04-19 09:16:34",
      end_time: "2023-04-19 09:17:34",
      errors: 1,
      tester_id: 1,
    });
    const response = await request(app)
      .post(`/attempts/${id}`)
      .send(body)
      .set("authorization", "Bearer tester");

    expect(response.status).toBe(200);
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

  it("Should return the elapsedTime", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2021-04-19 09:16:34"));
    const responseStart = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");
    const startTime = new Date().getTime();
    jest.useFakeTimers().setSystemTime(new Date("2021-04-19 09:16:35"));
    const responseEnd = await request(app)
      .post(`/attempts/${responseStart.body.id}`)
      .send(body)
      .set("authorization", "Bearer tester");
    const endTime = new Date().getTime();
    expect(responseEnd.body.elapsedTime).toBeGreaterThan(0);
    expect(responseEnd.body.elapsedTime / 2000).toBeCloseTo(
      (endTime - startTime) / 2000,
      1
    );
  });

  it("Should update end_date for the attempt", async () => {
    const id = await clickDay.tables.CdAttempts.do().insert({
      agency_code: "+31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      start_time: "2023-04-19 09:16:34",
      tester_id: 1,
    });
    await request(app)
      .post(`/attempts/${id[0]}`)
      .send(body)
      .set("authorization", "Bearer tester");
    const res = await clickDay.tables.CdAttempts.do()
      .select("end_time")
      .where({ id: id[0] })
      .first();
    expect(res?.end_time).not.toBeNull();
  });

  //Should return correct answer for email question
  it("Should return wrong answer for email when send wrong data", async () => {
    const responseStart = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");
    //get correct answer for email question
    const result = await clickDay.tables.CdAttemptsQuestions.do()
      .select("correct_answer")
      .where({ attempt_id: responseStart.body.id, type: "email" })
      .first();
    const correctAnswer = result?.correct_answer;
    const responseEnd = await request(app)
      .post(`/attempts/${responseStart.body.id}`)
      .send(body)
      .set("authorization", "Bearer tester");
    expect(responseEnd.body.success).toBe(false);
    expect(responseEnd.body.wrongAnswers).toBeDefined();

    // check if the wrongAnswers array contains the slug and yourAnswer
    let index = 0;
    responseEnd.body.wrongAnswers.find((item: { slug: string }, i: number) => {
      if (item.slug === "email") {
        index = i;
        return true;
      }
    });
    expect(responseEnd.body.wrongAnswers[index].slug).toBe("email");
    expect(responseEnd.body.wrongAnswers[index].yourAnswer).toBe("a");
    expect(responseEnd.body.wrongAnswers[index].correctAnswer).toBe(
      correctAnswer
    );
  });

  //Should return correct answer for bando question
  it("Should return wrong answer for bando when send wrong data", async () => {
    const responseStart = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");
    //get correct answer for bando question
    const result = await clickDay.tables.CdAttemptsQuestions.do()
      .select("correct_answer")
      .where({ attempt_id: responseStart.body.id, type: "bando" })
      .first();
    const correctAnswer = result?.correct_answer;
    const responseEnd = await request(app)
      .post(`/attempts/${responseStart.body.id}`)
      .send(body)
      .set("authorization", "Bearer tester");
    expect(responseEnd.body.success).toBe(false);
    expect(responseEnd.body.wrongAnswers).toBeDefined();

    // check if the wrongAnswers array contains the slug and yourAnswer
    let index = 0;
    responseEnd.body.wrongAnswers.find((item: { slug: string }, i: number) => {
      if (item.slug === "bando") {
        index = i;
        return true;
      }
    });
    expect(responseEnd.body.wrongAnswers[index].slug).toBe("bando");
    expect(responseEnd.body.wrongAnswers[index].yourAnswer).toBe("a");
    expect(responseEnd.body.wrongAnswers[index].correctAnswer).toBe(
      correctAnswer
    );
  });

  //Should return correct answer for last-numbers-bando question
  it("Should return wrong answer for last-numbers-bando when send wrong data", async () => {
    const responseStart = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");
    //get correct answer for last-numbers-bando question
    const result = await clickDay.tables.CdAttemptsQuestions.do()
      .select("correct_answer")
      .where({ attempt_id: responseStart.body.id, type: "last-numbers-bando" })
      .first();
    const correctAnswer = result?.correct_answer;
    const responseEnd = await request(app)
      .post(`/attempts/${responseStart.body.id}`)
      .send(body)
      .set("authorization", "Bearer tester");
    expect(responseEnd.body.success).toBe(false);
    expect(responseEnd.body.wrongAnswers).toBeDefined();

    // check if the wrongAnswers array contains the slug and yourAnswer
    let index = 0;
    responseEnd.body.wrongAnswers.find((item: { slug: string }, i: number) => {
      if (item.slug === "last-numbers-bando") {
        index = i;
        return true;
      }
    });
    expect(responseEnd.body.wrongAnswers[index].slug).toBe(
      "last-numbers-bando"
    );
    expect(responseEnd.body.wrongAnswers[index].yourAnswer).toBe("a");
    expect(responseEnd.body.wrongAnswers[index].correctAnswer).toBe(
      correctAnswer
    );
  });

  //Should return correct answer for month-vocals question
  it("Should return wrong answer for month-vocals when send wrong data", async () => {
    const responseStart = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");
    //get correct answer for month-vocals question
    const result = await clickDay.tables.CdAttemptsQuestions.do()
      .select("correct_answer")
      .where({ attempt_id: responseStart.body.id, type: "month-vocals" })
      .first();
    const correctAnswer = result?.correct_answer;
    const responseEnd = await request(app)
      .post(`/attempts/${responseStart.body.id}`)
      .send(body)
      .set("authorization", "Bearer tester");
    expect(responseEnd.body.success).toBe(false);
    expect(responseEnd.body.wrongAnswers).toBeDefined();

    // check if the wrongAnswers array contains the slug and yourAnswer
    let index = 0;
    responseEnd.body.wrongAnswers.find((item: { slug: string }, i: number) => {
      if (item.slug === "month-vocals") {
        index = i;
        return true;
      }
    });
    expect(responseEnd.body.wrongAnswers[index].slug).toBe("month-vocals");
    expect(responseEnd.body.wrongAnswers[index].yourAnswer).toBe("a");
    expect(responseEnd.body.wrongAnswers[index].correctAnswer).toBe(
      correctAnswer
    );
  });

  //Should return correct answer for amount question
  it("Should return wrong answer for amount when send wrong data", async () => {
    const responseStart = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");
    //get correct answer for amount question
    const result = await clickDay.tables.CdAttemptsQuestions.do()
      .select("correct_answer")
      .where({ attempt_id: responseStart.body.id, type: "amount" })
      .first();
    const correctAnswer = result?.correct_answer;
    const responseEnd = await request(app)
      .post(`/attempts/${responseStart.body.id}`)
      .send(body)
      .set("authorization", "Bearer tester");
    expect(responseEnd.body.success).toBe(false);
    expect(responseEnd.body.wrongAnswers).toBeDefined();

    // check if the wrongAnswers array contains the slug and yourAnswer
    let index = 0;
    responseEnd.body.wrongAnswers.find((item: { slug: string }, i: number) => {
      if (item.slug === "amount") {
        index = i;
        return true;
      }
    });
    expect(responseEnd.body.wrongAnswers[index].slug).toBe("amount");
    expect(responseEnd.body.wrongAnswers[index].yourAnswer).toBe("a");
    expect(responseEnd.body.wrongAnswers[index].correctAnswer).toBe(
      correctAnswer
    );
  });

  //Should return correct answer for axis question
  it("Should return wrong answer for axis when send wrong data", async () => {
    const responseStart = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");
    //get correct answer for axis question
    const result = await clickDay.tables.CdAttemptsQuestions.do()
      .select("correct_answer")
      .where({ attempt_id: responseStart.body.id, type: "axis" })
      .first();
    const correctAnswer = result?.correct_answer;
    const responseEnd = await request(app)
      .post(`/attempts/${responseStart.body.id}`)
      .send(body)
      .set("authorization", "Bearer tester");
    expect(responseEnd.body.success).toBe(false);
    expect(responseEnd.body.wrongAnswers).toBeDefined();

    // check if the wrongAnswers array contains the slug and yourAnswer
    let index = 0;
    responseEnd.body.wrongAnswers.find((item: { slug: string }, i: number) => {
      if (item.slug === "axis") {
        index = i;
        return true;
      }
    });
    expect(responseEnd.body.wrongAnswers[index].slug).toBe("axis");
    expect(responseEnd.body.wrongAnswers[index].yourAnswer).toBe("a");
    expect(responseEnd.body.wrongAnswers[index].correctAnswer).toBe(
      correctAnswer
    );
  });

  //Should return correct answer for moment-date question
  it("Should return wrong answer for moment-date when send wrong data", async () => {
    const responseStart = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");
    //get correct answer for moment-date question
    const result = await clickDay.tables.CdAttemptsQuestions.do()
      .select("correct_answer")
      .where({ attempt_id: responseStart.body.id, type: "moment-date" })
      .first();
    const correctAnswer = result?.correct_answer;
    const responseEnd = await request(app)
      .post(`/attempts/${responseStart.body.id}`)
      .send(body)
      .set("authorization", "Bearer tester");
    expect(responseEnd.body.success).toBe(false);
    expect(responseEnd.body.wrongAnswers).toBeDefined();

    // check if the wrongAnswers array contains the slug and yourAnswer
    let index = 0;
    responseEnd.body.wrongAnswers.find((item: { slug: string }, i: number) => {
      if (item.slug === "moment-date") {
        index = i;
        return true;
      }
    });
    expect(responseEnd.body.wrongAnswers[index].slug).toBe("moment-date");
    expect(responseEnd.body.wrongAnswers[index].yourAnswer).toBe("a");
    expect(responseEnd.body.wrongAnswers[index].correctAnswer).toBe(
      correctAnswer
    );
  });

  //Should return correct answer for today/tomorrow/yesterday question
  it("Should return correct answer for today/tomorrow/yesterday question", async () => {
    // start attempt
    const attemptStartRequest = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");

    // check what type of question was asked
    const resultTypes = await clickDay.tables.CdAttemptsQuestions.do()
      .select("type")
      .where({ attempt_id: attemptStartRequest.body.id });

    // search if type is today/tomorrow/yesterday
    let type = "";
    resultTypes.forEach(({ type: resultType }) => {
      if (
        resultType === "today" ||
        resultType === "tomorrow" ||
        resultType === "yesterday"
      )
        type = resultType;
    });

    // replace today/tomorrow/yesterday question in body array with current type and wrong answer
    const requestBody = body;
    body.find((item, index) => {
      if (item.slug === "today") {
        requestBody[index] = { slug: type, answer: "a" };
        return true;
      }
    });

    // get correct answer for {type} question
    const result = await clickDay.tables.CdAttemptsQuestions.do()
      .select("correct_answer")
      .where({ attempt_id: attemptStartRequest.body.id, type })
      .first();
    const correctAnswer = result?.correct_answer;

    // send answers and check correct answers
    const responseEnd = await request(app)
      .post(`/attempts/${attemptStartRequest.body.id}`)
      .send(requestBody)
      .set("authorization", "Bearer tester");

    expect(responseEnd.body.success).toBe(false);
    expect(responseEnd.body.wrongAnswers).toBeDefined();

    // check if the wrongAnswers array contains the slug and yourAnswer
    let index = 0;
    responseEnd.body.wrongAnswers.find((item: { slug: string }, i: number) => {
      if (item.slug === type) {
        index = i;
        return true;
      }
    });
    expect(responseEnd.body.wrongAnswers[index].slug).toBe(type);
    expect(responseEnd.body.wrongAnswers[index].yourAnswer).toBe("a");
    expect(responseEnd.body.wrongAnswers[index].correctAnswer).toBe(
      correctAnswer
    );
  });

  //Should return correct answer for first-characters/last-characters/first-numbers/last-numbers question
  it("Should return correct answer for first-characters/last-characters/first-numbers/last-numbers question", async () => {
    // start attempt
    const attemptStartRequest = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");

    // check what type of question was asked
    const resultTypes = await clickDay.tables.CdAttemptsQuestions.do()
      .select("type")
      .where({ attempt_id: attemptStartRequest.body.id });

    // search if type is first-characters/last-characters/first-numbers/last-numbers
    let type = "";
    resultTypes.forEach(({ type: resultType }) => {
      if (
        resultType === "first-characters" ||
        resultType === "last-characters" ||
        resultType === "first-numbers" ||
        resultType === "last-numbers"
      )
        type = resultType;
    });

    // replace first-characters/last-characters/first-numbers/last-numbers question in body array with current type and wrong answer
    const requestBody = body;
    body.find((item, index) => {
      if (item.slug === "first-characters") {
        requestBody[index] = { slug: type, answer: "a" };
        return true;
      }
    });

    // get correct answer for {type} question
    const result = await clickDay.tables.CdAttemptsQuestions.do()
      .select("correct_answer")
      .where({ attempt_id: attemptStartRequest.body.id, type })
      .first();
    const correctAnswer = result?.correct_answer;

    // send answers and check correct answers
    const responseEnd = await request(app)
      .post(`/attempts/${attemptStartRequest.body.id}`)
      .send(requestBody)
      .set("authorization", "Bearer tester");

    expect(responseEnd.body.success).toBe(false);
    expect(responseEnd.body.wrongAnswers).toBeDefined();

    // check if the wrongAnswers array contains the slug and yourAnswer
    let index = 0;
    responseEnd.body.wrongAnswers.find((item: { slug: string }, i: number) => {
      if (item.slug === type) {
        index = i;
        return true;
      }
    });
    expect(responseEnd.body.wrongAnswers[index].slug).toBe(type);
    expect(responseEnd.body.wrongAnswers[index].yourAnswer).toBe("a");
    expect(responseEnd.body.wrongAnswers[index].correctAnswer).toBe(
      correctAnswer
    );
  });

  //Should return success true if send all correct answers
  it("Should return success true if send all correct answers", async () => {
    // start attempt
    const attemptStartRequest = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");

    const correctAnswers = await clickDay.tables.CdAttemptsQuestions.do()
      .select("type", "correct_answer")
      .where({ attempt_id: attemptStartRequest.body.id });

    const requestBody = correctAnswers.map(({ type, correct_answer }) => {
      return { slug: type, answer: correct_answer };
    });

    const responseEnd = await request(app)
      .post(`/attempts/${attemptStartRequest.body.id}`)
      .send(requestBody)
      .set("authorization", "Bearer tester");

    expect(responseEnd.body.success).toBe(true);
    expect(responseEnd.body.wrongAnswers).not.toBeDefined();
  });

  // Should return number of errors if send any wrong answers
  it("Should return number of errors if send any wrong answers", async () => {
    // Start attempt
    const attemptStartRequest = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");

    // Get correct answer for email question
    const resultCorrect = await clickDay.tables.CdAttemptsQuestions.do()
      .select("correct_answer")
      .where({ attempt_id: attemptStartRequest.body.id, type: "email" })
      .first();
    const correctAnswerEmail = resultCorrect?.correct_answer;

    // Update request body with correct answer
    const requestBody = body;
    body.find((item, index) => {
      if (item.slug === "email") {
        requestBody[index] = {
          slug: "email",
          answer: correctAnswerEmail ?? "",
        };
        return true;
      }
    });

    // Finish attempt
    const responseEnd = await request(app)
      .post(`/attempts/${attemptStartRequest.body.id}`)
      .send(requestBody)
      .set("authorization", "Bearer tester");

    expect(responseEnd.body.success).toBe(false);
    expect(responseEnd.body.wrongAnswers).toBeDefined();

    // Check if errors are stored in database correctly
    const result = await clickDay.tables.CdAttempts.do()
      .select("errors")
      .where({ id: attemptStartRequest.body.id })
      .first();

    expect(result?.errors).toBe(responseEnd.body.wrongAnswers.length);
  });

  it("Should increase submissions for the attempt", async () => {
    const attemptStartRequest = await request(app)
      .post("/attempts")
      .send({
        code: "+6b9105e31b7d638349ad7b059ef1ebgd4af610c26c5b70c2cbdea528773d2c0d",
      })
      .set("authorization", "Bearer tester");

    const correctAnswers = await clickDay.tables.CdAttemptsQuestions.do()
      .select("type", "correct_answer")
      .where({ attempt_id: attemptStartRequest.body.id });

    const requestBody = correctAnswers.map(({ type, correct_answer }) => {
      return { slug: type, answer: correct_answer };
    });

    // firstSubmission
    await request(app)
      .post(`/attempts/${attemptStartRequest.body.id}`)
      .send(requestBody)
      .set("authorization", "Bearer tester");

    const res = await clickDay.tables.CdAttempts.do()
      .select("submissions")
      .where({ id: attemptStartRequest.body.id })
      .first();
    expect(res?.submissions).toBeGreaterThan(0);
    expect(res?.submissions).toBe(1);

    // secondSubmission
    await request(app)
      .post(`/attempts/${attemptStartRequest.body.id}`)
      .send(requestBody)
      .set("authorization", "Bearer tester");

    const res2 = await clickDay.tables.CdAttempts.do()
      .select("submissions")
      .where({ id: attemptStartRequest.body.id })
      .first();
    expect(res2?.submissions).toBe(2);
  });
});
