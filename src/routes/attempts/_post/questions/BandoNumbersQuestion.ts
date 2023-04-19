import DropdownQuestion from "./DropdownQuestion";

export default class BandoNumbersQuestion extends DropdownQuestion<"last-numbers-bando"> {
  constructor(bando: string) {
    super(
      "last-numbers-bando",
      "Seleziona le ultime 2 cifre del bando",
      ["18", "19", "20", "21", "22", "23"],
      { bando }
    );
  }

  protected getCorrect({ bando }: { bando: string }) {
    const correct = bando.slice(-2);
    const correctOption = this.currentOptions.find(
      (option) => option === correct
    );
    if (!correctOption) {
      throw new Error("Correct option not found");
    }
    return correctOption;
  }
}
