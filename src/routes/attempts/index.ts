/** OPENAPI-CLASS: post-attempts */

import { clickDay } from "@src/features/database";
import UserRoute from "@src/features/routes/UserRoute";

export default class Route extends UserRoute<{
  response: StoplightOperations["post-attempts"]["responses"]["200"]["content"]["application/json"];
  body: StoplightOperations["post-attempts"]["requestBody"]["content"]["application/json"];
}> {
  private code: string;

  constructor(configuration: RouteClassConfiguration) {
    super(configuration);
    this.code = this.getBody().code;
  }

  protected async prepare() {
    const id = await this.createAttempt();
    const email = await this.generateEmailQuestion(id);

    this.setSuccess(200, {
      id: 1,
      startTime: "2021-01-01T00:00:00.000Z",
      questions: [email],
    });
  }

  private async createAttempt() {
    await clickDay.tables.CdAttempts.do().insert({
      agency_code: this.code,
      tester_id: this.getTesterId(),
    });

    const attempt = await clickDay.tables.CdAttempts.do()
      .select("id")
      .where({
        agency_code: this.code,
        tester_id: this.getTesterId(),
      })
      .first();
    if (!attempt) {
      throw new Error("Attempt not found");
    }
    return attempt.id;
  }

  private async generateEmailQuestion(id: number) {
    const options = [
      "alba.castiglione@tryber.me",
      "lillo.siciliano@tryber.me",
      "callisto.lucchesi@tryber.me",
      "carolina.marino@tryber.me",
      "smeralda.endrizzi@tryber.me",
      "ferdinanda.barese@tryber.me",
      "nicoletta.pinto@tryber.me",
      "biagio.bruno@tryber.me",
    ];
    const correct = options[Math.floor(Math.random() * options.length)];
    await clickDay.tables.CdAttemptsQuestions.do().insert({
      attempt_id: id,
      type: "email",
      correct_answer: correct,
    });

    return {
      type: "dropdown" as const,
      title: `Seleziona l'indirizzo email del partecipante (${correct})`,
      slug: "email" as const,
      options,
    };
  }
}
