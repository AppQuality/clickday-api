import DropdownQuestion from "./DropdownQuestion";

export default class BandoAmountQuestion extends DropdownQuestion<"amount"> {
  constructor() {
    super("amount", "Seleziona l'importo dello stanziamento del bando", [
      "1€",
      "2€",
      "3€",
      "4€",
      "5€",
      "6€",
      "7€",
      "8€",
    ]);
  }
}
