/** OPENAPI-CLASS: post-attempts-id */

import { clickDay } from "@src/features/database";
import UserRoute from "@src/features/routes/UserRoute";

export default class Route extends UserRoute<{
  response: StoplightOperations["post-attempts-id"]["responses"]["200"]["content"]["application/json"];
  body: StoplightOperations["post-attempts-id"]["requestBody"]["content"]["application/json"];
  parameters: StoplightOperations["post-attempts-id"]["parameters"]["path"];
}> {
  private answers;
  private attempt_id;
  private allowedSlugs = [
    "email",
    "bando",
    "last-numbers-bando",
    "month-vocals",
    "amount",
    "axis",
    "moment-date",
    "today",
    "tomorrow",
    "yesterday",
    "first-characters",
    "last-characters",
    "first-numbers",
    "last-numbers",
  ];

  constructor(configuration: RouteClassConfiguration) {
    super(configuration);
    this.answers = this.getBody();
    const parameters = this.getParameters();
    if (parameters.id) this.attempt_id = Number(parameters.id);
  }

  protected async filter(): Promise<boolean> {
    if (!this.answers || !this.answers.length) {
      this.setError(400, {
        code: 400,
        message: "Missing answers",
      } as OpenapiError);
      return false;
    }
    if (
      this.answers.length !== 9 ||
      !this.answers.every((a) => typeof a.answer !== undefined) ||
      !this.answers.every((a) => typeof a.slug !== undefined) ||
      !this.answers.every((a) => this.allowedSlugs.includes(a.slug))
    ) {
      this.setError(400, {
        code: 400,
        message: "Invalid answers",
      } as OpenapiError);
      return false;
    }
    if (!this.attempt_id || (await this.attemptNotExist())) {
      this.setError(404, {
        code: 404,
        message: "Attempt not found",
      } as OpenapiError);
      return false;
    }

    return true;
  }

  protected async prepare() {
    this.setSuccess(200, {
      elapsedTime: "",
      success: true,
    });
  }

  private async attemptNotExist() {
    const attempt = await clickDay.tables.CdAttempts.do()
      .select("id")
      .where({ id: this.attempt_id })
      .first();
    return !attempt;
  }
}
