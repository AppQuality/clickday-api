import TextQuestion from "./TextQuestion";

export default class CharacterQuestion extends TextQuestion<
  "first-characters" | "last-characters" | "first-numbers" | "last-numbers"
> {
  constructor(code: string) {
    const { type, title, answer } = CharacterQuestion.getType(code);
    super(type, title, {
      answer,
    });
  }

  protected getCorrect({ answer }: { answer: string }) {
    return answer;
  }

  static getType(code: string) {
    switch (Math.floor(Math.random() * 4)) {
      case 0:
        return CharacterQuestion.firstCharacters(code);
      case 1:
        return CharacterQuestion.lastCharacters(code);
      case 2:
        return CharacterQuestion.firstNumbers(code);
      case 3:
        return CharacterQuestion.lastNumbers(code);
      default:
        throw new Error("Invalid random number");
    }
  }

  static firstCharacters(code: string) {
    return {
      type: "first-characters" as const,
      title: `Scrivi i primi 5 caratteri del codice`,
      answer: code.slice(0, 5),
    };
  }

  static lastCharacters(code: string) {
    return {
      type: "last-characters" as const,
      title: `Scrivi gli ultimi 5 caratteri del codice`,
      answer: code.slice(-5),
    };
  }

  static firstNumbers(code: string) {
    return {
      type: "first-numbers" as const,
      title: `Scrivi le prime 5 cifre del codice`,
      answer: code.replace(/\D/g, "").slice(0, 5),
    };
  }

  static lastNumbers(code: string) {
    return {
      type: "last-numbers" as const,
      title: `Scrivi le ultime 5 cifre del codice`,
      answer: code.replace(/\D/g, "").slice(-5),
    };
  }

  protected showAnswer(): boolean {
    return false;
  }
}
