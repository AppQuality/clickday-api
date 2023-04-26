/** OPENAPI-CLASS: get-attempts */

import { clickDay } from "@src/features/database";
import UserRoute from "@src/features/routes/UserRoute";

export default class Route extends UserRoute<{
  response: StoplightOperations["get-attempts"]["responses"]["200"]["content"]["application/json"];
}> {
  protected async prepare(): Promise<void> {
    const attempts = await this.getAttempts();
    return this.setSuccess(200, attempts);
  }

  private async getAttempts() {
    const attempts = await clickDay.tables.CdAttempts.do()
      .select("id", "agency_code", "start_time", "end_time", "errors")
      .where({
        tester_id: this.getTesterId(),
      })
      .whereNotNull("end_time")
      .orderBy("start_time", "desc");
    return attempts.map((attempt) => ({
      id: attempt.id,
      date: this.formatStartDate(attempt.start_time),
      time: this.getElapsedTime(attempt).toString(),
      code: attempt.agency_code,
      errors: attempt.errors ? attempt.errors : 0,
    }));
  }

  private formatStartDate(date: string) {
    const startDate = new Date(date);
    return `${startDate.getFullYear()}-${
      startDate.getMonth() + 1
    }-${startDate.getDate()}`;
  }

  private getElapsedTime(attempt: { start_time: string; end_time?: string }) {
    if (!attempt.end_time) return 0;
    const startDate = new Date(attempt.start_time);
    const endDate = new Date(attempt.end_time);
    return endDate.getTime() - startDate.getTime();
  }
}
