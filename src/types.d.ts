import { Response } from "express";
import { Request } from "openapi-backend";

import { components, operations, paths } from "./schema";

declare global {
  interface OpenapiResponse extends Response {
    skip_post_response_handler?: boolean;
    status_code: number;
  }
  interface OpenapiRequest extends Request {
    user: UserType;
    query: { [key: string]: string | { [key: string]: string } };
  }
  interface OpenapiError extends Error {
    status_code: number;
    code?: number;
  }

  type Olp = boolean | number[];
  type UserType = {
    ID: string;
    testerId: number;
    user_login: string;
    user_pass: string;
    role: string;
    capabilities: string[];
    permission: {
      admin?: {
        appq_bug?: Olp;
        appq_campaign?: Olp;
        appq_message_center?: Olp;
        appq_prospect?: Olp;
        appq_tester_selection?: Olp;
      };
    };
  };

  interface StoplightOperations extends operations {}
  interface StoplightComponents extends components {}
  interface StoplightPaths extends paths {}

  type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
  };

  type RouteClassTypes = Record<"response", any> &
    PartialRecord<"body" | "parameters" | "query", any>;

  type RouteClassConfiguration = {
    context: Context;
    request: OpenapiRequest;
    response: OpenapiResponse;
  };
}
