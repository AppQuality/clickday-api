/** OPENAPI-CLASS: post-events */
import OpenapiError from "@src/features/OpenapiError";
import { clickDay } from "@src/features/database";
import UserRoute from "@src/features/routes/UserRoute";
import BandoAmountQuestion from "@src/routes/attempts/_post/questions/v1/BandoAmountQuestion";
import BandoAxisQuestion from "@src/routes/attempts/_post/questions/v1/BandoAxisQuestion";
import BandoNumbersQuestion from "@src/routes/attempts/_post/questions/v1/BandoNumbersQuestion";
import BandoQuestion from "@src/routes/attempts/_post/questions/v1/BandoQuestion";
import CharacterQuestion from "@src/routes/attempts/_post/questions/v1/CharactersQuestion";
import DateQuestion from "@src/routes/attempts/_post/questions/v1/DateQuestion";
import EmailQuestion from "@src/routes/attempts/_post/questions/v1/EmailQuestion";
import MomentQuestion from "@src/routes/attempts/_post/questions/v1/MomentQuestion";
import MonthVocalsQuestion from "@src/routes/attempts/_post/questions/v1/MonthVocalsQuestion";
import { v4 as uuidv4 } from "uuid";
export default class Route extends UserRoute<{
  response: StoplightOperations["post-events"]["responses"]["200"]["content"]["application/json"];
  body: StoplightOperations["post-events"]["requestBody"]["content"]["application/json"];
}> {
  private title: StoplightOperations["post-events"]["requestBody"]["content"]["application/json"]["title"];
  private start_date: StoplightOperations["post-events"]["requestBody"]["content"]["application/json"]["start_date"];
  private end_date: StoplightOperations["post-events"]["requestBody"]["content"]["application/json"]["end_date"];
  private code: string;
  private version?: StoplightOperations["post-events"]["requestBody"]["content"]["application/json"]["version"];

  constructor(configuration: RouteClassConfiguration) {
    super(configuration);
    this.title = this.getBody().title;
    this.start_date = this.getBody().start_date;
    this.end_date = this.getBody().end_date;
    this.version = this.getBody().version;
    this.code = this.generateCode();
  }

  protected async filter(): Promise<boolean> {
    // Admin only
    if (this.getUser().role !== "administrator") {
      this.setError(403, new OpenapiError("Unauthorized"));
      return false;
    }

    if (new Date(this.start_date) > new Date(this.end_date)) {
      this.setError(
        400,
        new OpenapiError("The start date must be before the end date")
      );
      return false;
    }
    const existingEvent = await clickDay.tables.CdEvents.do()
      .select("id")
      .where("title", this.title);
    if (existingEvent.length > 0) {
      this.setError(400, new OpenapiError("Event already exists"));
      return false;
    }
    return true;
  }

  protected async prepare() {
    const event = await this.createEvent();
    const attempt_id = await this.createAttempt();
    await this.assignEventToAttempt(attempt_id, event.id);

    switch (this.version) {
      case 1:
        await this.generateV1Questions(attempt_id);
        break;
      default:
        await this.generateV1Questions(attempt_id);
        break;
    }

    this.setSuccess(200, {
      id: event.id,
      title: event.title,
    });
  }

  private async createEvent() {
    const event = await clickDay.tables.CdEvents.do()
      .insert({
        title: this.title,
        creation_date: new Date().toISOString().replace("T", " ").split(".")[0],
        start_date: this.start_date,
        end_date: this.end_date,
      })
      .returning(["id", "title", "start_date", "end_date"]);

    if (!event) {
      throw new Error("Event creation failed");
    }
    return {
      id: event[0].id ?? event[0],
      title: event[0].title ?? this.title,
      start_date: event[0].start_date ?? this.start_date,
      end_date: event[0].end_date ?? this.end_date,
    };
  }

  private async createAttempt() {
    const attempt = await clickDay.tables.CdAttempts.do()
      .insert({
        tester_id: 1,
        agency_code: this.code,
      })
      .returning("id");
    if (!attempt) {
      throw new Error("Attempt creation failed");
    }
    return attempt[0].id ?? attempt[0];
  }
  private async assignEventToAttempt(attempt_id: number, event_id: number) {
    const eventToAttempt = await clickDay.tables.CdEventsToAttempts.do().insert(
      {
        event_id,
        attempt_id,
        is_blueprint: 1,
      }
    );
    if (!eventToAttempt) {
      throw new Error("Event to attempt assignment failed");
    }
    return eventToAttempt;
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

  private generateCode = (): string => {
    let newId = uuidv4().split("-").concat(uuidv4().split("-")).join("");
    if (this.isThereAtleastFiveDigits(newId)) {
      return newId;
    } else {
      return this.generateCode();
    }
  };

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

  private isThereAtleastFiveDigits = (subject: string): boolean => {
    const regex5Digits = new RegExp(/\d{5,}/);
    return regex5Digits.test(subject);
  };

  private async generateV1Questions(attempt_id: number) {
    await this.generateEmailQuestion(attempt_id);
    await this.generateVocalsOfMonthQuestion(attempt_id);
    const { correct: correctBando } = await this.generateBandoQuestion(
      attempt_id
    );
    await this.generateLastBandoNumbersQuestion(attempt_id, correctBando);
    await this.generateAmountOfBandoQuestion(attempt_id);
    await this.generateAxisQuestion(attempt_id);
    await this.generateMomentDateQuestion(attempt_id);
    await this.generateDateQuestion(attempt_id);
    await this.generateCodeQuestion(attempt_id);
  }
}
