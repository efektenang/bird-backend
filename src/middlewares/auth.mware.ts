import { JwtService } from "@nestjs/jwt";
import { HttpStatus, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { Request, Response } from "@utilities/helper-type.util";
import { IJwtCustom, JwtCustom } from "@utilities/token-generator.util";

export declare type TExecValidateRequest = {
  desc: string;
  code?: string;
  name?: string;
};

@JwtCustom("jwtCustom")
export default class ValidateRequestBodyMiddleware implements NestMiddleware {
  jwtCustom: IJwtCustom;

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const validate = req.validations as FX_ROUTERS.TCombineOptValidate;

      if (
        (typeof validate.auth === "boolean" && validate.auth) ||
        typeof validate.auth !== "boolean"
      ) {
        const [_bearer, _token]: string[] =
          req.headers["authorization"].split(" ");
        if (process.env.AFX_BEARER !== _bearer) throw new Error();

        // put your auth payload
        req.user_auth = await this.jwtCustom.validate(_token);
      }

      next();
    } catch (er) {
      res.asJson(HttpStatus.UNAUTHORIZED, {
        message: "[AUTH] Authentication failed.",
      });
    }
  }
}
