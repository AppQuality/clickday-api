/** OPENAPI-CLASS: get-events */
import OpenapiError from "@src/features/OpenapiError";
import { clickDay } from "@src/features/database";
import UserRoute from "@src/features/routes/UserRoute";

export default class Route extends UserRoute<{
  response: StoplightOperations["get-events"]["responses"]["200"]["content"]["application/json"];
}> {
  protected async prepare(): Promise<void> {
    const event = await this.getLatestEvent();
    if (!event) return this.setNotFound();
    return this.setSuccess(200, {
      id: event.id,
      title: event.title,
    });
  }

  private async getLatestEvent() {
    const clickDayNow = clickDay.fn.now();
    const event = await clickDay.tables.CdEvents.do()
      .select()
      .where("start_date", "<=", clickDayNow)
      .where("end_date", ">=", clickDayNow)
      .orderBy("start_date", "asc")
      .first();

    return event;
  }

  private setNotFound() {
    return this.setError(404, new OpenapiError("No event found"));
  }
}
