import DropdownQuestion from "./DropdownQuestion";

export default class MonthVocalsQuestion extends DropdownQuestion<"month-vocals"> {
  constructor() {
    /* TODO: inserire il mese es.(Aprile) nella domanda */
    super("month-vocals", "Seleziona le vocali del mese della data odierna", [
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

  protected minimumOptions(): number {
    return 6;
  }
}
