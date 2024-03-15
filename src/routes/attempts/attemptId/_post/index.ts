/** OPENAPI-CLASS: post-attempts-id */

import OpenapiError from "@src/features/OpenapiError";
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
    "month-vocals",
    "bando",
    "last-numbers-bando",
    "amount",
    "axis",
    "moment-date",
    "yesterday",
    "first-characters",
    "tomorrow",
    "last-numbers",
    "today",
    "first-numbers",
    "last-characters",
    "bando-v2",
    "code-no-symbol-v2",
    "bando-ente-v2",
    "bando-amount-v2",
    "minutes-moment-v2",
    "site-url-v2",
    "code-symbol-v2",
  ];

  private _attempt:
    | {
        id: number;
        end_time: string;
        start_time: string;
        errors: number;
        submissions: number;
      }
    | undefined;

  constructor(configuration: RouteClassConfiguration) {
    super(configuration);
    this.answers = this.getBody();
    const parameters = this.getParameters();
    this.attempt_id = Number(parameters.id);
  }

  protected async init(): Promise<void> {
    try {
      this._attempt = await this.getAttempt();
    } catch (e) {
      const error = new OpenapiError("Attempt not found");
      this.setError(404, error);
      throw error;
    }
  }

  private async getAttempt() {
    const attempt = await clickDay.tables.CdAttempts.do()
      .select()
      .where({ id: this.attempt_id })
      .first();
    if (!attempt) throw new Error("Attempt not found");
    return attempt;
  }

  get attempt() {
    if (!this._attempt) throw new Error("Attempt not found");
    return this._attempt;
  }

  set errors(errors: number) {
    if (!this._attempt) throw new Error("Attempt not found");
    this._attempt.errors = errors;
  }

  set endTime(endTime: string) {
    if (!this._attempt) throw new Error("Attempt not found");
    this._attempt.end_time = endTime;
  }

  protected async filter(): Promise<boolean> {
    if (!this.answers || !this.answers.length) {
      this.setError(400, new OpenapiError("Missing answers"));
      return false;
    }
    if (
      !this.answers.every((a) => typeof a.answer !== undefined) ||
      !this.answers.every((a) => typeof a.slug !== undefined) ||
      !this.answers.every((a) => this.allowedSlugs.includes(a.slug))
    ) {
      this.setError(400, new OpenapiError("Invalid answers"));
      return false;
    }

    return true;
  }

  protected async prepare() {
    const wrongAnswers = await this.getWrongAnswers();
    const elapsedTime = this.updateTiming();
    this.updateSubmissions();
    this.errors = wrongAnswers.length ?? 0;

    await this.updateAttempt();

    this.setSuccess(200, {
      elapsedTime: elapsedTime,
      success: wrongAnswers.length === 0,
      ...(wrongAnswers.length > 0 && { wrongAnswers }),
    });
  }

  private async getWrongAnswers() {
    const correctAnswers = await this.getCorrectAnswers();
    return this.answers
      .filter((a) => {
        const correctAnswer = correctAnswers.find(
          (c) => c.type === a.slug
        )?.correct_answer;
        return correctAnswer !== a.answer;
      })
      .map((a) => {
        return {
          slug: a.slug,
          yourAnswer: a.answer,
          correctAnswer:
            correctAnswers.find((c) => c.type === a.slug)?.correct_answer || "",
        };
      });
  }

  private async getCorrectAnswers() {
    const correctAnswers = await clickDay.tables.CdAttemptsQuestions.do()
      .select("type", "correct_answer")
      .where({ attempt_id: this.attempt_id });
    return correctAnswers;
  }

  private updateTiming() {
    const endTime = new Date().toISOString().replace("T", " ").split(".")[0];
    this.endTime = endTime;
    const elapsedTime =
      new Date(endTime).getTime() - new Date(this.attempt.start_time).getTime();

    return elapsedTime;
  }

  private updateSubmissions() {
    ++this.attempt.submissions;
  }

  private async updateAttempt() {
    await clickDay.tables.CdAttempts.do()
      .update({
        errors: this.attempt.errors,
        end_time: this.attempt.end_time,
        submissions: this.attempt.submissions,
      })
      .where({ id: this.attempt_id });
  }
}
