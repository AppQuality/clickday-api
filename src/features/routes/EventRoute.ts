import OpenapiError from "../OpenapiError";
import { clickDay } from "../database";
import UserRoute from "./UserRoute";

export default class EventRoute<
  T extends RouteClassTypes & {
    parameters: T["parameters"] & { id: string };
  }
> extends UserRoute<T> {
  private event_id: number;

  constructor(configuration: RouteClassConfiguration) {
    super(configuration);
    const { id } = this.getParameters() as T["parameters"] & { id: string };
    this.event_id = Number(id);
  }

  protected async filter(): Promise<boolean> {
    try {
      // Check if event exists and is active (start_date <= now <= end_date)
      const event = await this.getEvent();
      if (!event) {
        this.setError(400, new OpenapiError("Event not found"));
        return false;
      }

      return true;
    } catch (error) {
      this.setError(400, new OpenapiError("Something went wrong"));
      return false;
    }
  }

  protected getEventId() {
    return this.event_id;
  }

  protected async getEvent() {
    const clickDayNow = clickDay.fn.now();
    const event = await clickDay.tables.CdEvents.do()
      .select()
      .where({ id: this.event_id })
      .where("start_date", "<=", clickDayNow)
      .where("end_date", ">=", clickDayNow)
      .first();
    if (!event) throw new Error("Event not found");
    return event;
  }

  protected async getEventAttempt() {
    const eventToAttempt = await clickDay.tables.CdEventsToAttempts.do()
      .select("attempt_id")
      .where({ event_id: this.event_id, is_blueprint: 1 })
      .limit(1)
      .first();
    if (!eventToAttempt) throw new Error("Event attempt_id not found");
    const eventAttempt = await clickDay.tables.CdAttempts.do()
      .select()
      .where({ id: eventToAttempt.attempt_id })
      .first();
    if (!eventAttempt) throw new Error("Event attempt not found");
    return eventAttempt;
  }

  protected async getEventAttemptQuestions() {
    const eventAttempt = await this.getEventAttempt();
    const eventAttemptQuestions = await clickDay.tables.CdAttemptsQuestions.do()
      .select()
      .where({ attempt_id: eventAttempt.id });

    if (!eventAttemptQuestions)
      throw new Error("Event attempt questions not found");

    const questions = eventAttemptQuestions.map((question) => {
      if (question.input_type === "dropdown") {
        return {
          title: question.title,
          type: question.input_type as "dropdown",
          slug: question.type as StoplightComponents["schemas"]["SelectQuestionSlug"],
          options: question.options.split(","),
          correct_answer: question.correct_answer,
        } as {
          title: string;
          type: "dropdown";
          slug: StoplightComponents["schemas"]["SelectQuestionSlug"];
          options: string[];
          correct_answer: string;
        };
      } else if (question.input_type === "text") {
        return {
          title: question.title,
          type: question.input_type as "text",
          slug: question.type as StoplightComponents["schemas"]["TextQuestionSlug"],
          correct_answer: question.correct_answer,
        } as {
          title: string;
          type: "text";
          slug: StoplightComponents["schemas"]["TextQuestionSlug"];
          correct_answer: string;
          options: undefined;
        };
      } else if (question.input_type === "radio") {
        return {
          title: question.title,
          type: question.input_type as "radio",
          slug: question.type as StoplightComponents["schemas"]["RadioQuestionSlug"],
          options: question.options.split(","),
          correct_answer: question.correct_answer,
        } as {
          title: string;
          type: "radio";
          slug: StoplightComponents["schemas"]["RadioQuestionSlug"];
          options: string[];
          correct_answer: string;
        };
      } else {
        throw new Error("Invalid question type");
      }
    });

    return questions;
  }
}
