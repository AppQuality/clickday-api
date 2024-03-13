import DropdownQuestion from "./DropdownQuestion";

export default class CodeNoSymbolQuestion extends DropdownQuestion<"code-no-symbol-v2"> {
  constructor() {
    super(
      "code-no-symbol-v2",
      `il codice identificativo senza considerare il "+" (più) o il "-" (meno)`,
      [
        "%cb92246a-0634-4b94-8473-a8503bee1962NonSelezionareQuestoToken0101",
        "(78d636ec-0737-45c6-8868-b1fbNonSelezionareQuestoToken01010836478b",
        ")7028b564-8a61-4a7NonSelezionareQuestoToken01011-995e-ec63607479df",
        "328e5322785bf012152d39a0d743660db839dd4b5add03df5bc04c810b085c7d",
        "@5e7c1897-8fb6-4cNonSelezionareQuestoToken0101d8-b706-7e5e14ed5015",
        "§66ae5000-f40d-4990-9c53-334e109d4abdNonSelezionareQuestoToken0101",
        "?NonSelezionareQuestoToken01010b34aeb9-24be-49fb-9c05-727d7ef74d36",
        "!1cf6999f-1364-4ace-b2a0NonSelezionareQuestoToken0101-377989e72b62",
      ]
    );
  }

  protected minimumOptions(): number {
    return 4;
  }
}
