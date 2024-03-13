import Question from "./Question";

export default class RadioQuestion<T extends string> extends Question<
  T,
  "radio"
> {
  constructor(
    slug: T,
    title: string,
    options: string[],
    args?: Record<string, any>
  ) {
    super(slug, title, "radio", options, args);
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

  protected minimumOptions() {
    return [...new Set(this.currentOptions)].length;
  }

  private optionsNumber() {
    return Math.floor(
      Math.random() *
        ([...new Set(this.currentOptions)].length - this.minimumOptions() + 1) +
        this.minimumOptions()
    );
  }

  public question() {
    const options = [...new Set(this.currentOptions)];

    let selected = options
      .sort(() => 0.5 - Math.random())
      .slice(0, this.optionsNumber());

    if (
      selected.find((option) => option === this.correctAnswer) === undefined
    ) {
      selected[selected.length - 1] = this.correctAnswer;
      selected = selected.sort(() => 0.5 - Math.random());
    }

    return {
      ...super.question(),
      options: selected,
    };
  }
}
