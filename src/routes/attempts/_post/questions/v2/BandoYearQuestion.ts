import RadioQuestion from "./RadioQuestion";

export default class BandoQuestion extends RadioQuestion<"bando-v2"> {
  constructor() {
    super("bando-v2", "l'anno del bando al quale stai partecipando", [
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026",
    ]);
  }

  protected minimumOptions(): number {
    return 4;
  }
}
