import DropdownQuestion from "./DropdownQuestion";

export default class MinutesMomentQuestion extends DropdownQuestion<"minutes-moment-v2"> {
  constructor() {
    super(
      "minutes-moment-v2",
      `i minuti del Momento ${Math.floor(Math.random() * 10) + 1}`,
      ["24", "23", "22", "20", "30", "26", "21", "32", "12"]
    );
  }

  protected minimumOptions(): number {
    return 4;
  }
}
