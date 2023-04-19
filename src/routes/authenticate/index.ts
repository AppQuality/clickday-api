/** OPENAPI-CLASS: post-authenticate */

import jwt from "jsonwebtoken";
import hasher from "wordpress-hash-node";

import OpenapiError from "@src/features/OpenapiError";
import Route from "@src/features/routes/Route";
import config from "../../config";
import authenticate from "../../features/wp/authenticate";
import getUserByName from "../../features/wp/getUserByName";

export default class AuthRoute extends Route<{
  response: StoplightOperations["post-authenticate"]["responses"]["200"]["content"]["application/json"];
  body: StoplightOperations["post-authenticate"]["requestBody"]["content"]["application/json"];
}> {
  private username: string;
  private password: string;

  constructor(config: RouteClassConfiguration) {
    super(config);
    const body = this.getBody();
    this.username = body.username;
    this.password = body.password;
  }

  protected async prepare(): Promise<void> {
    let userData;
    try {
      userData = await getUserByName(this.username);
    } catch (e) {
      console.log(e);
      this.setError(401, new OpenapiError("Invalid data"));
      return;
    }

    if (userData instanceof Error) {
      console.log(userData);
      this.setError(401, new OpenapiError("Invalid data"));
      return;
    }

    const checked = hasher.CheckPassword(this.password, userData.user_pass);

    if (!checked) {
      this.setError(
        401,
        new OpenapiError(
          "Password " + this.password + " not matching " + userData.user_login
        )
      );
      return;
    }

    const data = await authenticate(userData);

    if (data instanceof Error) {
      console.log(data);
      this.setError(401, new OpenapiError("Invalid data"));
      return;
    }

    const user = {
      ID: data.ID,
      testerId: data.testerId,
      role: data.role,
      permission: data.permission,
      capabilities: data.capabilities,
    };

    const token = jwt.sign(user, config.jwt.secret, {
      expiresIn: process.env.JWT_EXPIRATION || 9000,
    });
    const tokenData = jwt.decode(token);
    if (tokenData === null || typeof tokenData === "string") {
      this.setError(502, new OpenapiError("Failed token generation"));
      return;
    }

    const { iat, exp } = tokenData;

    this.setSuccess(200, {
      id: Number(data.ID),
      username: data.user_login,
      token: token,
      iat: iat,
      exp: exp,
    });
  }
}
