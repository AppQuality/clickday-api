/** OPENAPI-CLASS: get-attempts */

import OpenapiError from "@src/features/OpenapiError";
import { clickDay } from "@src/features/database";
import UserRoute from "@src/features/routes/UserRoute";

export default class Route extends UserRoute<{
  response: StoplightOperations["get-attempts"]["responses"]["200"]["content"]["application/json"];
}> {
  protected async prepare(): Promise<void> {
    try {
      const attempts = await this.getAttempts();

      return this.setSuccess(200, this.mapAttempts(attempts));
    } catch (e) {
      return this.setError(
        404,
        new OpenapiError("There are no attempts for this tester")
      );
    }
  }

  public async getAttempts() {
    const attempts = await clickDay.tables.CdAttempts.do()
      .select("id", "agency_code", "start_time", "end_time", "errors")
      .where({
        tester_id: this.getTesterId(),
      });
    if (!attempts) {
      return [];
    }
    return attempts;
  }

  private mapAttempts(
    attempts: Awaited<
      Promise<
        {
          id: number;
          agency_code: string;
          start_time: string;
          end_time: string | null;
          errors: number | null;
        }[]
      >
    >
  ) {
    return attempts.map((attempt) => {
      const startDate = new Date(attempt.start_time);
      const startDateString = `${startDate.getFullYear()}-${
        startDate.getMonth() + 1
      }-${startDate.getDate()}`;

      const startTime = new Date(attempt.start_time).getTime();
      const endTime = attempt.end_time
        ? new Date(attempt.end_time).getTime()
        : 0;

      return {
        id: attempt.id,
        date: startDateString,
        time: (attempt.end_time ? endTime - startTime : 0).toString(),
        code: attempt.agency_code,
        errors: attempt.errors ? Number(attempt.errors) : 0,
      };
    });
  }
}
