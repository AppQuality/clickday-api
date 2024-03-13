import RadioQuestion from "./RadioQuestion";

export default class SiteUrlQuestion extends RadioQuestion<"site-url-v2"> {
  constructor() {
    super("site-url-v2", `l'indirizzo url del sito INAIL`, [
      "https://www.inail.it",
      "https://www.inail.com/",
      "http://www.inail.org",
      "https://inail.con",
      "https://www.inanil.gov",
      "http://inail.ti",
      "https://www.inial.com",
      "http://www.inail.gov/",
      "https://www.inail.com",
      "http://www.inail.it",
    ]);
  }

  protected minimumOptions(): number {
    return 4;
  }
}
