import DropdownQuestion from "./DropdownQuestion";

export default class BandoAmountQuestion extends DropdownQuestion<"amount"> {
  constructor() {
    super("amount", "Seleziona l'importo dello stanziamento del bando", [
      "1200€",
      "2901€",
      "3989€",
      "4345€",
      "5986€",
      "6969€",
      "7102€",
      "8983€",
      "9999€",
    ]);
  }
  protected minimumOptions(): number {
    return 6;
  }
}
