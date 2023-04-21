/** OPENAPI-CLASS: post-attempts-id */

import OpenapiError from "@src/features/OpenapiError";
import { clickDay } from "@src/features/database";
import UserRoute from "@src/features/routes/UserRoute";
interface Attempt {
  id: number;
  tester_id: number;
  agency_code: string;
  start_time: string;
  end_time: string | null;
  errors: number | null;
}
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
      this.setError(400, new OpenapiError("Missing answers"));
      return false;
    }
    if (
      this.answers.length !== 9 ||
      !this.answers.every((a) => typeof a.answer !== undefined) ||
      !this.answers.every((a) => typeof a.slug !== undefined) ||
      !this.answers.every((a) => this.allowedSlugs.includes(a.slug))
    ) {
      this.setError(400, new OpenapiError("Invalid answers"));
      return false;
    }

    if (await this.attemptIsCompleted()) {
      this.setError(403, new OpenapiError("Attempt already finished"));
      return false;
    }

    if (!(await this.getAttempt())) {
      this.setError(404, new OpenapiError("Attempt not found"));
      return false;
    }

    return true;
  }

  protected async prepare() {
    const attempt = await this.getresults();
    if (!attempt) {
      this.setError(404, new OpenapiError("Attempt not found"));
      return;
    }
    this.setSuccess(200, attempt);
  }

  private async getAttempt() {
    const attempt = await clickDay.tables.CdAttempts.do()
      .select()
      .where({ id: this.attempt_id })
      .first();
    return attempt ?? false;
  }

  private async attemptIsCompleted() {
    const attempt = await clickDay.tables.CdAttempts.do()
      .select("id")
      .where({ id: this.attempt_id })
      .whereNotNull("end_time")
      .first();
    return attempt !== undefined;
  }

  private async getresults() {
    const attempt = await this.getAttempt();
    if (!attempt) return false;
    const wrongAnswers = await this.getWrongAnswers();
    const endTime = new Date();
    await this.updateAttempt(wrongAnswers.length ?? 0, endTime, attempt);

    const elapsedTime =
      endTime.getTime() - new Date(attempt.start_time).getTime();
    return {
      elapsedTime: elapsedTime,
      success: wrongAnswers.length === 0,
      ...(wrongAnswers.length > 0 && { wrongAnswers }),
    };
  }

  private async getWrongAnswers() {
    const correctAnswers = await this.getCorrectAnswers();
    let wrongAnswers = this.answers
      .filter((a) => {
        const correctAnswer = correctAnswers.find(
          (c) => c.type === a.slug
        )?.correct_answer;
        if (correctAnswer !== a.answer) {
          return true;
        }
        return false;
      })
      .map((a) => {
        return {
          slug: a.slug,
          yourAnswer: a.answer,
          correctAnswer:
            correctAnswers.find((c) => c.type === a.slug)?.correct_answer || "",
        };
      });
    return wrongAnswers;
  }

  private async updateAttempt(errors: number, endTime: Date, attempt: Attempt) {
    await clickDay.tables.CdAttempts.do()
      .update({
        end_time:
          endTime.getFullYear() +
          "-" +
          (endTime.getMonth() + 1) +
          "-" +
          endTime.getDate() +
          " " +
          endTime.getHours() +
          ":" +
          endTime.getMinutes() +
          ":" +
          endTime.getSeconds() +
          "." +
          endTime.getMilliseconds(),
        errors,
      })
      .where({ id: attempt.id });
  }

  private async getCorrectAnswers() {
    const correctAnswers = await clickDay.tables.CdAttemptsQuestions.do()
      .select("type", "correct_answer")
      .where({ attempt_id: this.attempt_id });
    return correctAnswers;
  }
}
