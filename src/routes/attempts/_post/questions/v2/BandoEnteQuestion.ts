import DropdownQuestion from "./DropdownQuestion";

export default class BandoEnteQuestion extends DropdownQuestion<"bando-ente-v2"> {
  constructor() {
    super("bando-ente-v2", `l'istituto che eroga il finanziamento`, [
      "INPDAP",
      "NAS",
      "NAIL",
      "INL",
      "INAIL",
      "INALI",
      "INAF",
      "INA",
      "INPS",
      "INFN",
    ]);
  }

  protected minimumOptions(): number {
    return 4;
  }
}
