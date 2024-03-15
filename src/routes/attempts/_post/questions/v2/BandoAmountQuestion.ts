import RadioQuestion from "./RadioQuestion";

export default class BandoAmountQuestion extends RadioQuestion<"bando-amount-v2"> {
  constructor() {
    super(
      "bando-amount-v2",
      "il numero composto dalla prima, seconda e quarta cifra dello stanziamento del bando",
      ["303", "333", "030", "033", "000", "330", "003", "300"]
    );
  }

  protected minimumOptions(): number {
    return 4;
  }
}
