import DropdownQuestion from "./DropdownQuestion";

export default class EmailQuestion extends DropdownQuestion<"email"> {
  constructor() {
    super("email", "Seleziona l'indirizzo email del partecipante", [
      "alba.castiglione@tryber.me",
      "lillo.siciliano@tryber.me",
      "callisto.lucchesi@tryber.me",
      "carolina.marino@tryber.me",
      "smeralda.endrizzi@tryber.me",
      "ferdinanda.barese@tryber.me",
      "nicoletta.pinto@tryber.me",
      "biagio.bruno@tryber.me",
      "delia.demetrio@tryber.me",
    ]);
  }

  protected minimumOptions(): number {
    return 6;
  }
}
