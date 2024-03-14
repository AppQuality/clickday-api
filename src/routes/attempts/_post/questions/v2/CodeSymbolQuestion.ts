import DropdownQuestion from "./DropdownQuestion";

export default class CodeNoSymbolQuestion extends DropdownQuestion<"code-no-symbol-v2"> {
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
    CodeNoSymbolQuestion.addOption(code.charAt(0));
    super(
      "code-no-symbol-v2",
      `il simbolo iniziale del codice identificativo`,
      CodeNoSymbolQuestion.options,
      { symbol: code.charAt(0) }
    );
  }

  protected minimumOptions(): number {
    return 4;
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
    CodeNoSymbolQuestion.options.splice(
      Math.floor(Math.random() * CodeNoSymbolQuestion.options.length),
      0,
      symbol
    );

    if (symbol === "+") {
      CodeNoSymbolQuestion.options.splice(
        Math.floor(Math.random() * CodeNoSymbolQuestion.options.length),
        0,
        "-"
      );
    } else if (symbol === "-") {
      CodeNoSymbolQuestion.options.splice(
        Math.floor(Math.random() * CodeNoSymbolQuestion.options.length),
        0,
        "+"
      );
    }
  }
}
