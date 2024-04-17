/** OPENAPI-CLASS: post-events-id-attempt */
import OpenapiError from "@src/features/OpenapiError";
import { clickDay } from "@src/features/database";
import EventRoute from "@src/features/routes/EventRoute";

export default class Route extends EventRoute<{
  response: StoplightOperations["post-events-id-attempt"]["responses"]["200"]["content"]["application/json"];
  parameters: StoplightOperations["post-events-id-attempt"]["parameters"]["path"];
}> {
  constructor(configuration: RouteClassConfiguration) {
    super(configuration);
  }

  protected async filter(): Promise<boolean> {
    if (!(await super.filter())) return false;
    if (await this.hasAlreadyAttempted()) {
      this.setError(403, new OpenapiError("You already attempted this event"));
      return false;
    }
    return true;
  }

  protected async prepare() {
    const attemptData = await this.createAttempt();
    const { attempt, questions } = attemptData;

    this.setSuccess(200, {
      id: attempt.id,
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
  }

  private async createAttempt() {
    // Get event blueprint attempt
    const event = await this.getEvent();
    const blueprintAttempt = await this.getEventAttempt();
    await clickDay.tables.CdAttempts.do().insert({
      agency_code: blueprintAttempt.agency_code,
      tester_id: this.getTesterId(),
      start_time: event.start_date,
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
      event_id: event.id,
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
  private async hasAlreadyAttempted() {
    const event = await this.getEvent();
    const testerId = this.getTesterId();
    const hasAttempted = await clickDay.tables.CdAttempts.do()
      .select()
      .join(
        "cd_events_to_attempts",
        "cd_attempts.id",
        "cd_events_to_attempts.attempt_id"
      )
      .where("cd_events_to_attempts.event_id", event.id)
      .andWhere("cd_attempts.tester_id", testerId)
      .whereNotNull("cd_attempts.end_time")
      .andWhere("cd_attempts.submissions", ">", 0);
    if (hasAttempted.length > 0) return true;
    return false;
  }
}
