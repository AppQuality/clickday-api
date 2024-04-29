/** OPENAPI-CLASS: get-events */
import OpenapiError from "@src/features/OpenapiError";
import { clickDay } from "@src/features/database";
import UserRoute from "@src/features/routes/UserRoute";

export default class Route extends UserRoute<{
  response: StoplightOperations["get-events"]["responses"]["200"]["content"]["application/json"];
}> {
  private event: { id: number; title: string; start_date: string };

  constructor(configuration: RouteClassConfiguration) {
    super(configuration);

    this.event = { id: 0, title: "", start_date: "" };
  }

  protected async filter(): Promise<boolean> {
    if (!(await super.filter())) return false;
    const event = await this.getLatestEvent();

    if (!event || !event.id) {
      this.setNotFound();
      return false;
    }

    if (await this.hasAlreadyAttempted()) {
      this.setError(403, new OpenapiError("You already attempted this event"));
      return false;
    }
    return true;
  }

  protected async prepare(): Promise<void> {
    try {
      // Todo: return attempt if exists but it's not completed?
      const attemptData = await this.createAttempt();
      if (!attemptData) return this.setNotFound();

      const { attempt, questions } = attemptData;

      this.setSuccess(200, {
        id: this.event.id,
        title: this.event.title,
        attempt_id: attempt.id,
        code: attempt.agency_code,
        startTime: new Date(attempt.start_time).toISOString(),
        questions: questions.map((question) => {
          if (question.type === "dropdown")
            return {
              title: question.title,
              options: question.options,
              slug: question.slug,
              type: question.type,
            };
          if (question.type === "radio")
            return {
              title: question.title,
              options: question.options,
              slug: question.slug,
              type: question.type,
            };
          // Text type
          return {
            title: question.title,
            slug: question.slug,
            type: question.type,
          };
        }),
      });
    } catch (error) {
      console.log("🚀 ~ Route ~ prepare ~ error:", error);
      this.setError(400, new OpenapiError("Something went wrong"));
    }
  }

  private async createAttempt() {
    // Get event blueprint attempt
    const blueprintAttempt = await this.getBluePrint();

    if (!blueprintAttempt) throw new Error("Blueprint attempt not found");

    await clickDay.tables.CdAttempts.do().insert({
      agency_code: blueprintAttempt.agency_code,
      tester_id: this.getTesterId(),
      start_time: this.event.start_date,
    });

    // Get user attempt
    const attempt = await clickDay.tables.CdAttempts.do()
      .select("id", "start_time", "agency_code")
      .where({
        agency_code: blueprintAttempt.agency_code,
        tester_id: this.getTesterId(),
      })
      // When there are multiple attempts, we want the last one
      .orderBy("id", "desc")
      .first();
    if (!attempt) throw new Error("Attempt not found");

    // Link user attempt to event
    await clickDay.tables.CdEventsToAttempts.do().insert({
      event_id: this.event.id,
      attempt_id: attempt.id,
      is_blueprint: 0,
    });

    // Get event attempt questions
    const eventAttemptQuestions = await this.getEventAttemptQuestions();

    for (const question of eventAttemptQuestions) {
      await clickDay.tables.CdAttemptsQuestions.do().insert({
        attempt_id: attempt.id,
        type: question.slug,
        correct_answer: question.correct_answer,
        input_type: question.type,
        title: question.title,
        ...(question.options && { options: question.options.join(",") }),
      });
    }

    return {
      attempt,
      questions: eventAttemptQuestions,
    };
  }

  protected async getBluePrint() {
    const eventToAttempt = await clickDay.tables.CdEventsToAttempts.do()
      .select("attempt_id")
      .where({ event_id: this.event.id, is_blueprint: 1 })
      .limit(1)
      .first();
    if (!eventToAttempt) {
      this.setNotFound();
      throw new Error("Blueprint not found");
    }
    const eventAttempt = await clickDay.tables.CdAttempts.do()
      .select()
      .where({ id: eventToAttempt.attempt_id })
      .first();
    if (!eventAttempt) throw new Error("Event attempt not found");
    return eventAttempt;
  }

  protected async getEventAttemptQuestions() {
    const eventAttempt = await this.getBluePrint();
    const eventAttemptQuestions = await clickDay.tables.CdAttemptsQuestions.do()
      .select()
      .where({ attempt_id: eventAttempt.id });

    if (!eventAttemptQuestions)
      throw new Error("Event attempt questions not found");

    const questions = eventAttemptQuestions.map((question) => {
      if (question.input_type === "dropdown") {
        return {
          title: question.title,
          type: question.input_type as "dropdown",
          slug: question.type as StoplightComponents["schemas"]["SelectQuestionSlug"],
          options: question.options.split(","),
          correct_answer: question.correct_answer,
        } as {
          title: string;
          type: "dropdown";
          slug: StoplightComponents["schemas"]["SelectQuestionSlug"];
          options: string[];
          correct_answer: string;
        };
      } else if (question.input_type === "text") {
        return {
          title: question.title,
          type: question.input_type as "text",
          slug: question.type as StoplightComponents["schemas"]["TextQuestionSlug"],
          correct_answer: question.correct_answer,
        } as {
          title: string;
          type: "text";
          slug: StoplightComponents["schemas"]["TextQuestionSlug"];
          correct_answer: string;
          options: undefined;
        };
      } else if (question.input_type === "radio") {
        return {
          title: question.title,
          type: question.input_type as "radio",
          slug: question.type as StoplightComponents["schemas"]["RadioQuestionSlug"],
          options: question.options.split(","),
          correct_answer: question.correct_answer,
        } as {
          title: string;
          type: "radio";
          slug: StoplightComponents["schemas"]["RadioQuestionSlug"];
          options: string[];
          correct_answer: string;
        };
      } else {
        throw new Error("Invalid question type");
      }
    });

    return questions;
  }

  private async hasAlreadyAttempted() {
    const testerId = this.getTesterId();
    const hasAttempted = await clickDay.tables.CdAttempts.do()
      .select()
      .join(
        "cd_events_to_attempts",
        "cd_attempts.id",
        "cd_events_to_attempts.attempt_id"
      )
      .where("cd_events_to_attempts.event_id", this.event.id)
      .andWhere("cd_attempts.tester_id", testerId)
      .whereNotNull("cd_attempts.end_time")
      .andWhere("cd_attempts.submissions", ">", 0);
    if (hasAttempted.length > 0) return true;
    return false;
  }

  private async getLatestEvent() {
    const clickDayNow = clickDay.fn.now();
    const event = await clickDay.tables.CdEvents.do()
      .select()
      .where("start_date", "<=", clickDayNow)
      .where("end_date", ">=", clickDayNow)
      .orderBy("start_date", "asc")
      .first();

    if (!event) return null;

    this.event = {
      id: event.id,
      title: event.title,
      start_date: event.start_date,
    };
    return event;
  }

  private setNotFound() {
    return this.setError(404, new OpenapiError("No event found"));
  }
}
