/** OPENAPI-CLASS: post-attempts */
import OpenapiError from "@src/features/OpenapiError";
import { clickDay } from "@src/features/database";
import UserRoute from "@src/features/routes/UserRoute";
import BandoAmountQuestionV1 from "./questions/v1/BandoAmountQuestion";
import BandoAxisQuestionV1 from "./questions/v1/BandoAxisQuestion";
import BandoNumbersQuestionV1 from "./questions/v1/BandoNumbersQuestion";
import BandoQuestionV1 from "./questions/v1/BandoQuestion";
import CharacterQuestionV1 from "./questions/v1/CharactersQuestion";
import DateQuestionV1 from "./questions/v1/DateQuestion";
import EmailQuestionV1 from "./questions/v1/EmailQuestion";
import MomentQuestionV1 from "./questions/v1/MomentQuestion";
import MonthVocalsQuestionV1 from "./questions/v1/MonthVocalsQuestion";
import BandoEnteQuestionV2 from "@src/routes/attempts/_post/questions/v2/BandoEnteQuestion";
import BandoYearQuestionV2 from "@src/routes/attempts/_post/questions/v2/BandoYearQuestion";
import BandoAmountQuestionV2 from "@src/routes/attempts/_post/questions/v2/BandoAmountQuestion";
import CodeNoSymbolQuestionV2 from "@src/routes/attempts/_post/questions/v2/CodeNoSymbolQuestion";
import MinutesMomentQuestionV2 from "@src/routes/attempts/_post/questions/v2/MinutesMomentQuestion";
import SiteUrlQuestionV2 from "@src/routes/attempts/_post/questions/v2/SiteUrlQuestion";
import CodeSymbolQuestionV2 from "@src/routes/attempts/_post/questions/v2/CodeSymbolQuestion";

export default class Route extends UserRoute<{
  response: StoplightOperations["post-attempts"]["responses"]["200"]["content"]["application/json"];
  body: StoplightOperations["post-attempts"]["requestBody"]["content"]["application/json"];
}> {
  private code: string;
  private version?: number;

  constructor(configuration: RouteClassConfiguration) {
    super(configuration);
    const { code, version } = this.getBody();
    this.code = code;
    this.version = version;
  }

  protected async filter(): Promise<boolean> {
    if (!this.code) {
      this.setError(400, new OpenapiError("Missing code"));
      return false;
    }
    if (!this.code.startsWith("+") && !this.code.startsWith("-")) {
      this.setError(400, new OpenapiError("Invalid code"));
      return false;
    }
    return true;
  }

  protected async prepare() {
    const { id: attempt_id, start_time } = await this.createAttempt();

    let questions: StoplightOperations["post-attempts"]["responses"]["200"]["content"]["application/json"]["questions"] =
      [];
    switch (this.version) {
      case 1:
        questions = await this.generateV1Questions(attempt_id);
        break;
      case 2:
        questions = await this.generateV2Questions(attempt_id);
        break;
      default:
        questions = await this.generateV1Questions(attempt_id);
        break;
    }

    this.setSuccess(200, {
      id: attempt_id,
      startTime: new Date(start_time).toISOString(),
      questions,
    });
  }

  private async createAttempt() {
    await clickDay.tables.CdAttempts.do().insert({
      agency_code: this.code,
      tester_id: this.getTesterId(),
      start_time: new Date().toISOString().replace("T", " ").split(".")[0],
    });

    const attempt = await clickDay.tables.CdAttempts.do()
      .select("id", "start_time")
      .where({
        agency_code: this.code,
        tester_id: this.getTesterId(),
      })
      // When there are multiple attempts, we want the last one
      .orderBy("id", "desc")
      .first();
    if (!attempt) {
      throw new Error("Attempt not found");
    }
    return attempt;
  }

  private async generateEmailQuestionV1(attempt_id: number) {
    const result = new EmailQuestionV1();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateVocalsOfMonthQuestionV1(attempt_id: number) {
    const result = new MonthVocalsQuestionV1();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateBandoQuestionV1(attempt_id: number) {
    const result = new BandoQuestionV1();
    await result.insert(attempt_id);
    const correct = result.correctAnswer;
    return {
      question: result.question(),
      correct,
    };
  }

  private async generateLastBandoNumbersQuestionV1(
    attempt_id: number,
    bando: string
  ) {
    const result = new BandoNumbersQuestionV1(bando);
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateAmountOfBandoQuestionV1(attempt_id: number) {
    const result = new BandoAmountQuestionV1();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateAxisQuestionV1(attempt_id: number) {
    const result = new BandoAxisQuestionV1();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateMomentDateQuestionV1(attempt_id: number) {
    const result = new MomentQuestionV1();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateDateQuestionV1(attempt_id: number) {
    const result = new DateQuestionV1();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateCodeQuestionV1(attempt_id: number) {
    const result = new CharacterQuestionV1(this.code);
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateBandoYearQuestionV2(attempt_id: number) {
    const result = new BandoYearQuestionV2();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateCodeNoSymbolQuestionV2(attempt_id: number) {
    const result = new CodeNoSymbolQuestionV2(this.code);
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateBandoEnteQuestionV2(attempt_id: number) {
    const result = new BandoEnteQuestionV2();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateBandoAmountQuestionV2(attempt_id: number) {
    const result = new BandoAmountQuestionV2();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateMinutesMomentQuestionV2(attempt_id: number) {
    const result = new MinutesMomentQuestionV2();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateSiteUrlQuestionV2(attempt_id: number) {
    const result = new SiteUrlQuestionV2();
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateCodeSymbolQuestionV2(attempt_id: number) {
    const result = new CodeSymbolQuestionV2(this.code);
    await result.insert(attempt_id);
    return result.question();
  }

  private async generateV1Questions(attempt_id: number) {
    const email = await this.generateEmailQuestionV1(attempt_id);
    const vocalsOfMonth = await this.generateVocalsOfMonthQuestionV1(
      attempt_id
    );
    const { question: bando, correct: correctBando } =
      await this.generateBandoQuestionV1(attempt_id);

    const lastBandoNumbers = await this.generateLastBandoNumbersQuestionV1(
      attempt_id,
      correctBando
    );
    const amountOfBando = await this.generateAmountOfBandoQuestionV1(
      attempt_id
    );
    const axis = await this.generateAxisQuestionV1(attempt_id);
    const momentDate = await this.generateMomentDateQuestionV1(attempt_id);
    const date = await this.generateDateQuestionV1(attempt_id);
    const code = await this.generateCodeQuestionV1(attempt_id);

    return [
      email,
      vocalsOfMonth,
      bando,
      lastBandoNumbers,
      amountOfBando,
      axis,
      momentDate,
      date,
      code,
    ];
  }

  private async generateV2Questions(attempt_id: number) {
    const bandoYear = await this.generateBandoYearQuestionV2(attempt_id);
    const codeNoSymbol = await this.generateCodeNoSymbolQuestionV2(attempt_id);
    const bandoEnte = await this.generateBandoEnteQuestionV2(attempt_id);
    const bandoAmount = await this.generateBandoAmountQuestionV2(attempt_id);
    const minutesMoment = await this.generateMinutesMomentQuestionV2(
      attempt_id
    );
    const siteUrl = await this.generateSiteUrlQuestionV2(attempt_id);
    const codeSymbol = await this.generateCodeSymbolQuestionV2(attempt_id);

    return [
      bandoYear,
      codeNoSymbol,
      bandoEnte,
      bandoAmount,
      minutesMoment,
      siteUrl,
      codeSymbol,
    ];
  }
}
