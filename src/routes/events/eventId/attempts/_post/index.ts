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
    const blueprintAttempt = await this.getEventAttempt();

    await clickDay.tables.CdAttempts.do().insert({
      agency_code: blueprintAttempt.agency_code,
      tester_id: this.getTesterId(),
      start_time: new Date().toISOString().replace("T", " ").split(".")[0],
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

    return attempt;
  }
}
