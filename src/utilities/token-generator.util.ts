// import jwt from 'jsonwebtoken'
import { createParamDecorator, ExecutionContext, Module } from "@nestjs/common";
import * as CryptoJS from "crypto-js";
import {
  JwtSecretRequestType,
  JwtService,
  JwtSignOptions,
  JwtVerifyOptions,
} from "@nestjs/jwt";
import { performance } from "perf_hooks";
import { IJwtPayload, Request } from "./helper-type.util";

const option = { expiresIn: process.env.AFX_EXPIRED_TOKEN };
const jwt: any = {};

/** The function is mean to re-encrypt the payload of token. */
const secureToken = function (token: string, type: "dec" | "enc"): string {
  let stor = "";
  let splitToken = token.split(".");
  if (splitToken.length === 3) {
    if (type === "dec") {
      const decrypted = CryptoJS.AES.decrypt(
        splitToken[1],
        process.env.AFX_PAYLOAD_REENCRYPT_KEY
      );
      splitToken[1] = decrypted.toString(CryptoJS.enc.Utf8);
    } else if (type === "enc") {
      const encrypted = CryptoJS.AES.encrypt(
        splitToken[1],
        process.env.AFX_PAYLOAD_REENCRYPT_KEY
      );
      splitToken[1] = encrypted.toString();
    }
  }
  stor = splitToken.join(".");

  return stor;
};

async function destructTokens(auth): Promise<string> {
  try {
    const token: string = secureToken(auth, "dec");
    return token;
  } catch (er) {
    throw new Error();
  }
}

export interface IJwtCustom {
  readonly generateToken: (payload: IJwtPayload) => Promise<string>;
  readonly validate: (authorization: string) => Promise<IJwtPayload>;
  readonly update: (
    jwtPayloads: IJwtPayload,
    replacement: Partial<IJwtPayload>
  ) => Promise<string>;
}

/** Use class decorator to remapping property (JwtCustom) as given the specific of property name.*/
export function JwtCustom(property: string) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      jwtService: JwtService = new JwtService({
        secret: process.env["AFX_SECRET_KEY"],
        global: true,
        signOptions: { expiresIn: process.env["AFX_EXPIRED_TOKEN"] },
      });

      constructor(...agg: any[]) {
        super();

        const constList = Object.keys(this as any);

        // // Remapping lost constructor on customize the class
        for (let x in agg) {
          if (agg[x] instanceof JwtService) {
            this.jwtService = agg[x];
            continue;
          }
          this[constList[x]] = agg[x];
        }

        if (!this.jwtService) {
          throw new Error(
            `JWT Services is never called in class "${constructor.name}".`
          );
        }

        this[property] = {
          generateToken: async (payload: IJwtPayload): Promise<string> => {
            const jwt = await this.jwtService.signAsync(payload);
            const secureJwt = secureToken(jwt, "enc");
            return secureJwt;
          },
          validate: async (auth: string): Promise<IJwtPayload> => {
            const token = await destructTokens(auth);
            const payload = await this.jwtService.verifyAsync(token);
            return payload;
          },
          update: async (
            jwtPayloads: IJwtPayload,
            replacement: Partial<IJwtPayload>
          ): Promise<string> => {
            try {
              const { exp, ...others }: IJwtPayload = jwtPayloads;

              const jwt = await this.jwtService.signAsync({
                ...others,
                ...replacement,
              });
              const secureJwt = secureToken(jwt, "enc");
              return secureJwt;
            } catch (er) {
              throw new Error(er.message);
            }
          },
        } as IJwtCustom;
      }
    };
  };
}

/** Use decorator variable to call the function of generateToken */
function generateToken() {
  return (target: any, key?: string) => {
    Object.defineProperty(target, key, {
      get: () => (payload: any, jwtServices: JwtService) => {
        return jwtServices.signAsync(payload);
      },
      enumerable: true,
      configurable: true,
    });
  };
}
