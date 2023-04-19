import Question from "./Question";

export default class DropdownQuestion<T extends string> extends Question<
  T,
  "dropdown"
> {
  constructor(
    slug: T,
    title: string,
    options: string[],
    args?: Record<string, any>
  ) {
    super(slug, title, "dropdown", options, args);
  }

  protected getCorrect(args: Record<string, any> = {}) {
    return this.currentOptions[
      Math.floor(Math.random() * this.currentOptions.length)
    ];
  }

  get currentOptions() {
    if (!this.options) throw new Error("No options provided");
    return this.options;
  }

  public question() {
    return {
      ...super.question(),
      options: [...new Set(this.currentOptions)],
    };
  }
}
