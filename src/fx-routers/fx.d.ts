import { FX_ROUTERS } from '.fx-routers/fx'
import { RouteTree } from '@nestjs/core'
import { RequestMethod } from '@nestjs/common'
import { NextFunction, Request } from 'express'

interface IProtectProps<T, TR> {
  /** Able to consuming authentication payload (only work if status of "auth" is true) */
  authPayload: T
  /** Able to consuming request payload */
  requestPayload: TR
}

// Global typeof Option Validate
type OptValidateX = {
  /** Name of route.*/
  suffix?: string[] | string

  /** Name of route.*/
  name: string

  /**
   Code of route, the "Code" must be unique
  */
  code: string

  /** If set to "true", the logs would be save to DB (Default: true)*/
  logging?: boolean

  /** If set to "false" the request would not be authenticated with (Default: true).*/
  auth?: boolean

  /** To protect the routes, when the return is "false" the request would be return error 403.*/
  protect?: <T, TR>(
    props: IProtectProps<T, TR>,
    next: NextFunction
  ) => void | null
}

// only use in GET methods
type OptValidateA = {}

// use in except of GET methods
type OptValidateB = {
  /** The max of size body in Megabyte (MB).*/
  maxBodySize?: number
}

interface TCombineOptValidate
  extends OptValidateX,
    OptValidateA,
    OptValidateB {}

type TValidateRequest = {
  [Px in keyof typeof RequestMethod]?: {
    [Ox in keyof (OptValidateX &
      (Px extends 'GET' ? OptValidateA : OptValidateB))]: (OptValidateX &
      (Px extends 'GET' ? OptValidateA : OptValidateB))[Ox]
  }[]
}

type TRouterConfigs = Omit<RouteTree, 'children'> & {
  children?: TRouterConfigs[]
} & { checks?: TValidateRequest }

export as namespace FX_ROUTERS
