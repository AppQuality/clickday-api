import TextQuestion from "./TextQuestion";

export default class DateQuestion extends TextQuestion<
  "yesterday" | "today" | "tomorrow"
> {
  constructor() {
    const { type, itString, date } = DateQuestion.getType();
    super(type, `Scrivi la data di ${itString} in formato gg/mm/aaaa`, {
      date,
    });
  }

  protected getCorrect({ date }: { date: Date }) {
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  static getType() {
    switch (Math.floor(Math.random() * 3) - 1) {
      case -1:
        return DateQuestion.yesterday();
      case 0:
        return DateQuestion.today();
      case 1:
        return DateQuestion.tomorrow();
      default:
        throw new Error("Invalid random number");
    }
  }

  static today() {
    const date = new Date();
    return { type: "today" as const, itString: "oggi", date };
  }

  static yesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return { type: "yesterday" as const, itString: "ieri", date };
  }

  static tomorrow() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return { type: "tomorrow" as const, itString: "domani", date };
  }

  protected showAnswer(): boolean {
    return false;
  }
}
