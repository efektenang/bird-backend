import FX_ROUTERS from './fx'
import {
  DynamicModule,
  ForwardReference,
  Injectable,
  Type
} from '@nestjs/common'

/** Load all modules from routes*/
type TDestructRoutes = {
  dstModules: (
    | Type<any>
    | DynamicModule
    | Promise<DynamicModule>
    | ForwardReference<any>
  )[]
  dstChecks: any
}

function destructCheck(
  paths: string[],
  checks: FX_ROUTERS.TValidateRequest
): { [Path: string]: FX_ROUTERS.TValidateRequest } {
  let checkRequest: any = {}
  const currCheck = Object.keys(checks || {})

  for (const x in currCheck) {
    const itemLists: FX_ROUTERS.TCombineOptValidate[] =
      checks[currCheck[x]] || []
    for (const a in itemLists) {
      const items: FX_ROUTERS.TCombineOptValidate = itemLists[a]
      const consistentPath = (
        typeof items.suffix === 'string' ? [...paths, items.suffix] : paths
      ).join('/')
      checkRequest = Object.assign(checkRequest, {
        [`${currCheck[x]}@/${consistentPath}`]: items
      })
      console.log(
        '\x1b[1m\x1b[35m[CLOG]\x1b[0m\x1b[37m Mapped validation',
        `{/${consistentPath}, ${currCheck[x]}, \x1b[35m${items.code}\x1b[0m}`
      )
    }
  }

  return checkRequest
}

@Injectable()
export class ValidationRoute {
  private static validations: any = {}

  static get() {
    return this.validations
  }

  static registerValidations(routes: FX_ROUTERS.TRouterConfigs[] = []) {
    const { dstChecks, dstModules } = this.destructModuleFromRoutes(routes)

    this.validations = Object.assign(this.validations, dstChecks)
    return dstModules
  }

  static destructModuleFromRoutes(
    routes: FX_ROUTERS.TRouterConfigs[] = [],
    paths: string[] = []
  ): TDestructRoutes {
    return routes.reduce(
      (a: TDestructRoutes, b: FX_ROUTERS.TRouterConfigs) => {
        let obj: any = null
        const currCheck = Object.keys(b.checks || {})
        if (Array.isArray(b.children) && b.children.length > 0) {
          const childs = this.destructModuleFromRoutes(
            b.children as FX_ROUTERS.TRouterConfigs[],
            [...paths, b.path]
          )
          obj = { module: childs.dstModules, check: { ...childs.dstChecks } }
        } else if (b.module || currCheck.length > 0) {
          obj = {
            module: b.module ? [b.module] : [],
            check:
              currCheck.length > 0
                ? destructCheck([...paths, b.path], b.checks)
                : {}
          }
        }

        return {
          dstModules: Array.isArray(obj.module)
            ? [...a.dstModules, ...obj.module]
            : a.dstModules,
          dstChecks: obj.check ? { ...a.dstChecks, ...obj.check } : a.dstChecks
        } as TDestructRoutes
      },
      { dstModules: [], dstChecks: {} } as TDestructRoutes
    )
  }
}
