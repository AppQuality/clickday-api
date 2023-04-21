import DropdownQuestion from "./DropdownQuestion";

export default class MonthVocalsQuestion extends DropdownQuestion<"month-vocals"> {
  constructor() {
    super("month-vocals", "Seleziona la vocale del mese", [
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
    ]);
  }

  protected getCorrect() {
    const date = new Date();
    const month = date.getMonth();
    return this.currentOptions[month];
  }

  protected showAnswer(): boolean {
    return false;
  }
}
