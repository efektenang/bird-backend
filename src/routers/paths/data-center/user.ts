import { UserModule } from "@main/users/user.module";

export const RouteUser: FX_ROUTERS.TRouterConfigs = {
  path: "users",
  module: UserModule,
  checks: {
    GET: [
      {
        code: "GET-USER",
        name: "Get data users",
        auth: false,
      },
      {
        suffix: ":userId",
        code: "GET-USER",
        name: "Get current user info",
        auth: true,
      },
    ],
    POST: [
      {
        suffix: "login",
        code: "POST-LOGIN",
        name: "Sign in user.",
        auth: false,
      },
      {
        suffix: "register",
        code: "POST-REG",
        name: "Register new user.",
        auth: true,
      },
      {
        suffix: "change-password",
        code: "POST-PASS",
        name: "Change password user.",
        auth: true,
      },
      {
        suffix: "update",
        code: "POST-UPDATE",
        name: "Update basic user info",
        auth: true,
      },
    ],
  },
};
