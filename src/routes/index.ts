import debugMessage from "@src/features/debugMessage";
import fs from "fs";
import glob from "glob";
import OpenAPIBackend, { Context } from "openapi-backend";
import { parse } from "comment-parser";

type RouteObject = {
  name: string;
  handler: (
    c: Context,
    req: OpenapiRequest,
    res: OpenapiResponse
  ) => Promise<any>;
};
class Routes {
  private basePath: string;
  private fileList: string[];

  constructor(basePath: string) {
    this.basePath = basePath;
    this.fileList = glob.sync(`${basePath}/**/*.ts`);
  }

  get routes(): RouteObject[] {
    return this.fileList
      .map((file) => {
        const routeComment = new RouteComment(file);
        if (routeComment.operationClass) {
          return {
            name: routeComment.operationClass,
            handler: this.getClassHandler(file),
          };
        }
        return null;
      })
      .filter((route): route is RouteObject => route !== null);
  }

  private formatPath(file: string) {
    return file.replace(this.basePath, ".").replace("index.ts", "");
  }
  private getClassHandler(file: string) {
    return async (
      context: Context,
      request: OpenapiRequest,
      response: OpenapiResponse
    ) => {
      try {
        let Class = require(this.formatPath(file)).default;
        const route = new Class({ context, request, response });
        return await route.resolve();
      } catch (e) {
        debugMessage((e as OpenapiError).message);
        response.status_code = 500;
        let code = (e as OpenapiError).code;
        if (typeof code !== "number") {
          code = 500;
        }
        return {
          message: (e as OpenapiError).message,
          code,
          error: true,
        };
      }
    };
  }
}

class RouteComment {
  public operationClass: string | false;

  constructor(file: string) {
    const comments = this.extractFileContent(file);

    const classComment = comments.find((comment) =>
      comment.description.includes("OPENAPI-CLASS")
    );
    if (!classComment) this.operationClass = false;
    else this.operationClass = classComment.description.split(":")[1].trim();
  }

  extractFileContent(file: string) {
    const fileContent = fs.readFileSync(file, "utf8");
    return parse(fileContent);
  }
}

export default (api: OpenAPIBackend) => {
  const routeHandler = new Routes("./src/routes");
  routeHandler.routes.forEach((route) => {
    api.register(route.name, route.handler);
  });
};
