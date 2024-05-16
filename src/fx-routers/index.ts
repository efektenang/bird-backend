import { DynamicModule, Injectable, Module, Provider } from "@nestjs/common";
import { ValidationRoute } from "./generator";
import { RouterModule } from "@nestjs/core";
import { routes as RouterConfigs } from "@routers/app.router";

import * as path from "path";

const replacements = {
  rootDir: path.join(path.resolve(__dirname), "../../.."),
};

@Injectable()
export class FX_PUB {
  constructor() {}

  verifyRoutes(
    method: string,
    bashUrl: string
  ): FX_ROUTERS.TCombineOptValidate {
    const currRoutes = ValidationRoute.get();
    const mappingKeys = Object.keys(currRoutes);
    const foundUrl = mappingKeys.filter((a) => {
      const _key = a.replace(/\?/g, "([a-zA-Z0-9_-]+)");
      return `${method}@${bashUrl}`.match(new RegExp(`^${_key}$`, "g"));
    })[0];

    const settings = currRoutes[foundUrl] || null || {};
    return settings;
  }
}

@Module({
  providers: [ValidationRoute],
})
export class FxRouterModules {
  static register(): DynamicModule[] {
    let modules = ValidationRoute.registerValidations(RouterConfigs);
    modules.push(RouterModule.register(RouterConfigs));
    return modules as DynamicModule[];
  }
}
