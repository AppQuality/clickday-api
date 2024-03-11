import Route from "./Route";

export default class UserRoute<T extends RouteClassTypes> extends Route<T> {
  private testerId: number;
  private wordpressId: number;
  private user: UserType;

  constructor(
    configuration: RouteClassConfiguration & {
      element?: string;
      id?: number;
    }
  ) {
    super({
      ...configuration,
      id: configuration.request.user.testerId,
    });
    this.testerId = this.configuration.request.user.testerId;
    this.wordpressId = parseInt(this.configuration.request.user.ID);
    this.user = this.configuration.request.user;
  }

  protected getTesterId() {
    return this.testerId;
  }
  protected getWordpressId() {
    return this.wordpressId;
  }
  protected getUser() {
    return this.user;
  }
}
