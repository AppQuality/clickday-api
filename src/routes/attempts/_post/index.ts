/** OPENAPI-CLASS: post-attempts */

import { clickDay } from "@src/features/database";
import UserRoute from "@src/features/routes/UserRoute";

export default class Route extends UserRoute<{
  response: StoplightOperations["post-attempts"]["responses"]["200"]["content"]["application/json"];
  body: StoplightOperations["post-attempts"]["requestBody"]["content"]["application/json"];
}> {
  private code: string;
  private bando: string;
  private date: string;

  constructor(configuration: RouteClassConfiguration) {
    super(configuration);
    this.code = this.getBody().code;
    this.bando = "";
    this.date = "";
  }

  protected async filter(): Promise<boolean> {
    if (!this.code) {
      this.setError(400, {
        code: 400,
        message: "Missing code",
      } as OpenapiError);
      return false;
    }
    if (!this.code.startsWith("+") && !this.code.startsWith("-")) {
      this.setError(400, {
        code: 400,
        message: "Invalid code",
      } as OpenapiError);
      return false;
    }
    return true;
  }

  protected async prepare() {
    const { id: attempt_id, start_time } = await this.createAttempt();

    const email = await this.generateEmailQuestion(attempt_id);
    const vocalsOfMonth = await this.generateVocalsOfMonthQuestion(attempt_id);
    const bando = await this.generateBandoQuestion(attempt_id);
    const lastBandoNumbers = await this.generateLastBandoNumbersQuestion(
      attempt_id
    );
    const amountOfBando = await this.generateAmountOfBandoQuestion(attempt_id);
    const axis = await this.generateAxisQuestion(attempt_id);
    const momentDate = await this.generateMomentDateQuestion(attempt_id);
    const date = await this.generateDateQuestion(attempt_id);
    const code = await this.generateCodeQuestion(attempt_id);

    this.setSuccess(200, {
      id: 1,
      startTime: new Date(start_time).toISOString(),
      questions: [
        email,
        vocalsOfMonth,
        bando,
        lastBandoNumbers,
        amountOfBando,
        axis,
        momentDate,
        date,
        code,
      ],
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
    await clickDay.tables.CdAttemptsQuestions.do().insert({
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

  private async generateAmountOfBandoQuestion(attempt_id: number) {
    const options = ["1", "2", "3", "4", "5", "6", "7", "8"];

    const correct = options[Math.floor(Math.random() * options.length)];

    await clickDay.tables.CdAttemptsQuestions.do().insert({
      attempt_id,
      type: "amount",
      correct_answer: correct,
    });

    return {
      type: "dropdown" as const,
      title: `Seleziona l'importo dello stanziamento del bando (${correct}€)`,
      slug: "amount" as const,
      options,
    };
  }

  private async generateAxisQuestion(attempt_id: number) {
    const options = ["123", "456", "789", "012", "412", "892"];
    const correct = options[Math.floor(Math.random() * options.length)];
    await clickDay.tables.CdAttemptsQuestions.do().insert({
      attempt_id,
      type: "axis",
      correct_answer: correct,
    });

    return {
      type: "dropdown" as const,
      title: `Seleziona il codice dell'asse (${correct})`,
      slug: "axis" as const,
      options,
    };
  }

  private async generateMomentDateQuestion(attempt_id: number) {
    // options are 5 dynamic dates with format DD/MM/YYYY that start from 2 days ago
    const options = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 2 + i);
      return date.toLocaleDateString("it-IT", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }); // YYYY/MM/DD
    });

    const correct = options[Math.floor(Math.random() * options.length)];

    await clickDay.tables.CdAttemptsQuestions.do().insert({
      attempt_id,
      type: "moment-date",
      correct_answer: correct,
    });

    return {
      type: "dropdown" as const,
      title: `Seleziona la data del momento (${correct})`,
      slug: "moment-date" as const,
      options,
    };
  }

  private async generateDateQuestion(attempt_id: number) {
    // Choose a random element from -1 to 1
    const random = Math.floor(Math.random() * 3) - 1;

    let type = "";
    switch (random) {
      case -1:
        this.date = "ieri";
        type = "yesterday";
        break;
      case 0:
        this.date = "oggi";
        type = "today";
        break;
      case 1:
        this.date = "domani";
        type = "tomorrow";
        break;
    }

    // Correct answer is yesterday (-1), today (0) or tomorrow (1)
    const date = new Date();
    date.setDate(date.getDate() + random);

    await clickDay.tables.CdAttemptsQuestions.do().insert({
      attempt_id,
      type,
      correct_answer: date.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }), // DD/MM/YYYY
    });

    return {
      type: "text" as const,
      title: `Scrivi la data di ${this.date} in formato gg/mm/aaaa`,
      slug: type,
    };
  }

  private async generateCodeQuestion(attempt_id: number) {
    const length = 5;

    // Choose a random element from 0 to 3
    const random = Math.floor(Math.random() * 4);

    let type = "";
    let correct = "";
    let question = "";
    switch (random) {
      case 0:
        type = "first-characters";
        correct = this.code.slice(0, length);
        question = `Scrivi i primi ${length} caratteri del codice`;
        break;
      case 1:
        type = "last-characters";
        correct = this.code.slice(-length);
        question = `Scrivi gli ultimi ${length} caratteri del codice`;
        break;
      case 2:
        type = "first-numbers";
        correct = this.code.replace(/\D/g, "").slice(0, length);
        question = `Scrivi i primi ${length} numeri del codice`;
        break;
      case 3:
        type = "last-numbers";
        correct = this.code.replace(/\D/g, "").slice(-length);
        question = `Scrivi gli ultimi ${length} numeri del codice`;
        break;
    }

    await clickDay.tables.CdAttemptsQuestions.do().insert({
      attempt_id,
      type,
      correct_answer: correct,
    });

    return {
      type: "text" as const,
      title: `${question} (${this.code})`,
      slug: type,
    };
  }
}
