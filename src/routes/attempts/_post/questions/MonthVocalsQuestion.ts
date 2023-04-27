import DropdownQuestion from "./DropdownQuestion";

export default class MonthVocalsQuestion extends DropdownQuestion<"month-vocals"> {
  constructor() {
    const MONTHS = [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ];
    super(
      "month-vocals",
      `Seleziona le vocali del mese della data odierna (${
        MONTHS[new Date().getMonth()]
      })`,
      [
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
      ]
    );
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
