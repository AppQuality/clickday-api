/** OPENAPI-CLASS: post-attempts */
import { clickDay } from "@src/features/database";
import UserRoute from "@src/features/routes/UserRoute";
import BandoAmountQuestion from "./questions/BandoAmountQuestion";
import BandoAxisQuestion from "./questions/BandoAxisQuestion";
import BandoNumbersQuestion from "./questions/BandoNumbersQuestion";
import BandoQuestion from "./questions/BandoQuestion";
import CharacterQuestion from "./questions/CharactersQuestion";
import DateQuestion from "./questions/DateQuestion";
import EmailQuestion from "./questions/EmailQuestion";
import MomentQuestion from "./questions/MomentQuestion";
import MonthVocalsQuestion from "./questions/MonthVocalsQuestion";

export default class Route extends UserRoute<{
  response: StoplightOperations["post-attempts"]["responses"]["200"]["content"]["application/json"];
  body: StoplightOperations["post-attempts"]["requestBody"]["content"]["application/json"];
}> {
  private code: string;

  constructor(configuration: RouteClassConfiguration) {
    super(configuration);
    this.code = this.getBody().code;
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
    const { question: bando, correct: correctBando } =
      await this.generateBandoQuestion(attempt_id);
    const lastBandoNumbers = await this.generateLastBandoNumbersQuestion(
      attempt_id,
      correctBando
    );
    const amountOfBando = await this.generateAmountOfBandoQuestion(attempt_id);
    const axis = await this.generateAxisQuestion(attempt_id);
    const momentDate = await this.generateMomentDateQuestion(attempt_id);
    const date = await this.generateDateQuestion(attempt_id);
    const code = await this.generateCodeQuestion(attempt_id);

    this.setSuccess(200, {
      id: attempt_id,
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
    const result = new EmailQuestion();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateVocalsOfMonthQuestion(attempt_id: number) {
    const result = new MonthVocalsQuestion();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateBandoQuestion(attempt_id: number) {
    const result = new BandoQuestion();
    await result.insert(attempt_id);
    const correct = result.correctAnswer;
    return {
      question: result.question(),
      correct,
    };
  }

  private async generateLastBandoNumbersQuestion(
    attempt_id: number,
    bando: string
  ) {
    const result = new BandoNumbersQuestion(bando);
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateAmountOfBandoQuestion(attempt_id: number) {
    const result = new BandoAmountQuestion();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateAxisQuestion(attempt_id: number) {
    const result = new BandoAxisQuestion();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateMomentDateQuestion(attempt_id: number) {
    const result = new MomentQuestion();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateDateQuestion(attempt_id: number) {
    const result = new DateQuestion();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateCodeQuestion(attempt_id: number) {
    const result = new CharacterQuestion(this.code);
    await result.insert(attempt_id);
    return result.question();
  }
}
