import DropdownQuestion from "./DropdownQuestion";

export default class BandoQuestion extends DropdownQuestion<"bando"> {
  constructor() {
    super("bando", "Seleziona il bando al quale stai partecipando", [
      "Bando 2018",
      "Bando 2019",
      "Bando 2020",
      "Bando 2021",
      "Bando 2022",
      "Bando 2023",
    ]);
  }
}
