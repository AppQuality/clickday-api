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
    const attempt = await this.createAttempt();
    const questions = await this.getEventAttemptQuestions();

    this.setSuccess(200, {
      id: attempt.id,
      startTime: new Date(attempt.start_time).toISOString(),
      questions,
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

    const attempt = await clickDay.tables.CdAttempts.do()
      .select("id", "start_time")
      .where({
        agency_code: blueprintAttempt.agency_code,
        tester_id: this.getTesterId(),
      })
      // When there are multiple attempts, we want the last one
      .orderBy("id", "desc")
      .first();
    if (!attempt) throw new Error("Attempt not found");
    await clickDay.tables.CdEventsToAttempts.do().insert({
      event_id: event.id,
      attempt_id: attempt.id,
      is_blueprint: 0,
    });

    const eventAttemptQuestions = await clickDay.tables.CdAttemptsQuestions.do()
      .select()
      .where({ attempt_id: blueprintAttempt.id });

    for (const question of eventAttemptQuestions) {
      await clickDay.tables.CdAttemptsQuestions.do().insert({
        attempt_id: attempt.id,
        type: question.type,
        correct_answer: question.correct_answer,
        input_type: question.input_type,
        title: question.title,
        ...(question.options && { options: question.options }),
      });
    }

    return attempt;
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
