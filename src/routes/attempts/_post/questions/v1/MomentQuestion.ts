import DropdownQuestion from "./DropdownQuestion";

export default class MomentQuestion extends DropdownQuestion<"moment-date"> {
  constructor() {
    super("moment-date", "Seleziona la data del momento", [
      "Momento 1 : 26/10/2021",
      "Momento 2 : 12/12/2022",
      "Momento 3 : 26/12/2021",
      "Momento 4 : 26/09/2019",
      "Momento 5 : 26/10/2021",
      "Momento 6 : 12/12/2022",
      "Momento 7 : 13/12/2018",
      "Momento 8 : 26/09/2019",
      "Momento 9 : 26/10/2021",
    ]);
  }

  protected minimumOptions(): number {
    return 5;
  }
}
