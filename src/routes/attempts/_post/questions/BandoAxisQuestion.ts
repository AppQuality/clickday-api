import DropdownQuestion from "./DropdownQuestion";

export default class BandoAxisQuestion extends DropdownQuestion<"axis"> {
  constructor() {
    super("axis", "Seleziona il codice dell'asse", [
      "123",
      "456",
      "789",
      "012",
      "412",
      "892",
    ]);
  }
}
