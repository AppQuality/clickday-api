import DropdownQuestion from "./DropdownQuestion";

export default class CodeSymbolQuestion extends DropdownQuestion<"code-symbol-v2"> {
  private static readonly options = [
    "%",
    "@",
    "!",
    "?",
    ")",
    "§",
    "_",
    "/",
    "=",
    "#",
    "$",
    "[",
  ];

  constructor(code: string) {
    CodeSymbolQuestion.addOption(code.charAt(0));
    super(
      "code-symbol-v2",
      `il simbolo iniziale del codice identificativo`,
      CodeSymbolQuestion.options,
      { symbol: code.charAt(0) }
    );
  }

  protected minimumOptions(): number {
    return CodeSymbolQuestion.options.length;
  }

  protected getCorrect({ symbol }: { symbol: string }) {
    const correctOption = this.currentOptions.find(
      (option) => option === symbol
    );
    if (!correctOption) {
      throw new Error("Correct option no symbol not found");
    }
    return correctOption;
  }

  static addOption(symbol: string) {
    CodeSymbolQuestion.options.splice(
      Math.floor(Math.random() * CodeSymbolQuestion.options.length),
      0,
      symbol
    );

    if (symbol === "+") {
      CodeSymbolQuestion.options.splice(
        Math.floor(Math.random() * CodeSymbolQuestion.options.length),
        0,
        "-"
      );
    } else if (symbol === "-") {
      CodeSymbolQuestion.options.splice(
        Math.floor(Math.random() * CodeSymbolQuestion.options.length),
        0,
        "+"
      );
    }
  }
}
