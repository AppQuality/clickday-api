import DropdownQuestion from "./DropdownQuestion";

export default class MomentQuestion extends DropdownQuestion<"moment-date"> {
  constructor() {
    const options = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 2 + i);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    });
    super("moment-date", "Seleziona la data del momento", options);
  }
}
