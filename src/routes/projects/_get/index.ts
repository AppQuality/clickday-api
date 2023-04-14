/** OPENAPI-CLASS: get-projects */
import Route from "@src/features/routes/Route";

interface Project {
  id: number;
  name: string;
  description: string;
}

export default class GetProjects extends Route<{
  response: StoplightOperations["get-projects"]["responses"]["200"]["content"]["application/json"];
  query: StoplightOperations["get-projects"]["parameters"]["query"];
}> {
  protected async prepare(): Promise<void> {
    await super.prepare();

    return this.setSuccess(200, {
      items: this.getProjects(),
    });
  }

  private getProjects(): Project[] {
    return [
      {
        id: 1,
        name: "Project 1",
        description: "Description 1",
      },
      {
        id: 2,
        name: "Project 2",
        description: "Description 2",
      },
      {
        id: 3,
        name: "Project 3",
        description: "Description 3",
      },
    ];
  }
}
