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
    const { id: attempt_id, start_time } = await this.createAttempt();

    const email = await this.generateEmailQuestion(attempt_id);
    const vocalsOfMonth = await this.generateVocalsOfMonthQuestion(attempt_id);

    this.setSuccess(200, {
      id: 1,
      startTime: new Date(start_time).toISOString(),
      questions: [email, vocalsOfMonth],
    });
  }

  private async createAttempt() {
    await clickDay.tables.CdAttempts.do().insert({
      agency_code: this.code,
      tester_id: this.getTesterId(),
    });

    const attempt = await clickDay.tables.CdAttempts.do()
      .select("id", "start_time")
      .where({
        agency_code: this.code,
        tester_id: this.getTesterId(),
      })
      .first();
    if (!attempt) {
      throw new Error("Attempt not found");
    }
    return attempt;
  }

  private async generateEmailQuestion(attempt_id: number) {
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
    const insert = await clickDay.tables.CdAttemptsQuestions.do().insert({
      attempt_id,
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

  private async generateVocalsOfMonthQuestion(attempt_id: number) {
    const options = [
      "eaio",
      "eaio",
      "ao",
      "aie",
      "aio",
      "iuo",
      "uio",
      "ao",
      "e",
      "oe",
      "oe",
      "ie",
    ];
    const date = new Date();
    const month = date.getMonth();
    const correct = options[month];
    const insert = await clickDay.tables.CdAttemptsQuestions.do().insert({
      attempt_id,
      type: "month-vocals",
      correct_answer: correct,
    });

    return {
      type: "dropdown" as const,
      title: `Seleziona la vocale del mese (${correct})`,
      slug: "month-vocals" as const,
      options: [...new Set(options)],
    };
  }
}
