import { clickDay } from "@src/features/database";

export default class Question<
  T extends string,
  K extends "text" | "dropdown" | "radio"
> {
  private correct: string;

  constructor(
    private slug: T,
    private title: string,
    private type: K,
    protected options?: string[],
    args?: Record<string, any>
  ) {
    this.correct = this.getCorrect(args);
  }

  protected getCorrect(args: Record<string, any> = {}) {
    return "";
  }

  public async insert(attempt_id: number) {
    await clickDay.tables.CdAttemptsQuestions.do().insert({
      attempt_id,
      type: this.slug,
      correct_answer: this.correct,
      input_type: this.type,
      title: `${
        this.showAnswer() ? `Selezionare ${this.correct}, ${this.title}` : ""
      }`,
      options: this.options ? this.options.join(",") : undefined,
    });
  }

  public question() {
    return {
      type: this.type,
      title: `${this.title}${this.showAnswer() ? ` (${this.correct})` : ""}`,
      slug: this.slug,
    };
  }

  protected showAnswer() {
    return true;
  }

  get correctAnswer() {
    return this.correct;
  }
}
