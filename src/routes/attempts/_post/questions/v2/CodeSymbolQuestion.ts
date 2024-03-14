import DropdownQuestion from "./DropdownQuestion";

export default class CodeNoSymbolQuestion extends DropdownQuestion<"code-symbol-v2"> {
  private static currentOptions = [
    "%",
    "@",
    "!",
    "?",
    ")",
    "§",
    "_",
    "/",
    ".",
    "=",
    "*",
    "#",
    "$",
    "[",
  ];
  private static correctIndex = Math.floor(
    Math.random() * CodeNoSymbolQuestion.currentOptions.length
  );

  constructor(code: string) {
    super(
      "code-symbol-v2",
      `il primo carattere del codice identificativo`,
      CodeNoSymbolQuestion.currentOptions.splice(
        CodeNoSymbolQuestion.correctIndex,
        0,
        code.charAt(0)
      )
    );
  }

  protected minimumOptions(): number {
    return 4;
  }

  protected getCorrect(args: Record<string, any> = {}) {
    return CodeNoSymbolQuestion.currentOptions[
      CodeNoSymbolQuestion.correctIndex
    ];
  }
}
