import { LogModule } from "@main/log/log.module";

export const RouteLogs: FX_ROUTERS.TRouterConfigs = {
  path: "logs",
  module: LogModule,
  checks: {
    GET: [
      {
        code: "GET-USER",
        name: "Get data users",
        auth: true,
      },
    ]
  },
};
