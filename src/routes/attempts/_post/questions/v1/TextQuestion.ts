import Question from "./Question";

export default class TextQuestion<T extends string> extends Question<
  T,
  "text"
> {
  constructor(slug: T, title: string, args?: Record<string, any>) {
    super(slug, title, "text", undefined, args);
  }
}
