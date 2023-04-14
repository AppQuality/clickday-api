/** OPENAPI-CLASS: get-users-me */

import OpenapiError from "@src/features/OpenapiError";
import { tryber } from "@src/features/database";
import UserRoute from "@src/features/routes/UserRoute";

export default class Route extends UserRoute<{
  response: StoplightOperations["get-users-me"]["responses"]["200"]["content"]["application/json"];
}> {
  protected async prepare(): Promise<void> {
    try {
      const { name } = await this.getTester();

      return this.setSuccess(200, {
        id: this.getTesterId(),
        name,
      });
    } catch (e) {
      return this.setError(
        404,
        new OpenapiError("There is no user with this id")
      );
    }
  }

  private async getTester() {
    const tester = await tryber.tables.WpAppqEvdProfile.do()
      .select("name")
      .where({
        id: this.getTesterId(),
      })
      .first();
    if (!tester) {
      throw new Error("Tester not found");
    }
    return tester;
  }
}
