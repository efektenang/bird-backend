import { RouteLogs } from "./paths/data-center/logs";
import { RouteUser } from "./paths/data-center/user";

export const routes: FX_ROUTERS.TRouterConfigs[] = [
  {
    path: "api/v1",
    children: [
      // Data Center
      RouteUser,
      RouteLogs
    ],
  },
];
