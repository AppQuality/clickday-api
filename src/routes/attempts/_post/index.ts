/** OPENAPI-CLASS: post-attempts */

import { clickDay } from "@src/features/database";
import UserRoute from "@src/features/routes/UserRoute";

export default class Route extends UserRoute<{
  response: StoplightOperations["post-attempts"]["responses"]["200"]["content"]["application/json"];
  body: StoplightOperations["post-attempts"]["requestBody"]["content"]["application/json"];
}> {
  private code: string;
  private bando: string;

  constructor(configuration: RouteClassConfiguration) {
    super(configuration);
    this.code = this.getBody().code;
    this.bando = "";
  }

  protected async prepare() {
    const { id: attempt_id, start_time } = await this.createAttempt();

    const email = await this.generateEmailQuestion(attempt_id);
    const vocalsOfMonth = await this.generateVocalsOfMonthQuestion(attempt_id);
    const bando = await this.generateBandoQuestion(attempt_id);
    const lastBandoNumbers = await this.generateLastBandoNumbersQuestion(
      attempt_id
    );

    this.setSuccess(200, {
      id: 1,
      startTime: new Date(start_time).toISOString(),
      questions: [email, vocalsOfMonth, bando, lastBandoNumbers],
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
    await clickDay.tables.CdAttemptsQuestions.do().insert({
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

  private async generateBandoQuestion(attempt_id: number) {
    const options = [
      "Bando 2018",
      "Bando 2019",
      "Bando 2020",
      "Bando 2021",
      "Bando 2022",
      "Bando 2023",
    ];

    const correct = options[Math.floor(Math.random() * options.length)];
    this.bando = correct;

    await clickDay.tables.CdAttemptsQuestions.do().insert({
      attempt_id,
      type: "bando",
      correct_answer: correct,
    });

    return {
      type: "dropdown" as const,
      title: `Seleziona il bando al quale stai partecipando (${correct})`,
      slug: "bando" as const,
      options,
    };
  }

  private async generateLastBandoNumbersQuestion(attempt_id: number) {
    const options = ["18", "19", "20", "21", "22", "23"];

    // Get the last two digits of the bando
    const correct = this.bando.slice(-2);

    // Pick correct answer from options
    const correctOption = options.find((option) => option === correct);

    await clickDay.tables.CdAttemptsQuestions.do().insert({
      attempt_id,
      type: "last-numbers-bando",
      correct_answer: correctOption,
    });

    return {
      type: "dropdown" as const,
      title: `Seleziona le ultime 2 cifre del bando (${correct})`,
      slug: "last-numbers-bando" as const,
      options,
    };
  }
}
