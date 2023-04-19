import DropdownQuestion from "./DropdownQuestion";

export default class MomentQuestion extends DropdownQuestion<"moment-date"> {
  constructor() {
    const options = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 2 + i);
      return date.toLocaleDateString("it-IT", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }); // YYYY/MM/DD
    });
    super("moment-date", "Seleziona la data del momento", options);
  }
}
