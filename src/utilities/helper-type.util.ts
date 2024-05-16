import { Response as Resp, Request as Reqs } from 'express'
import { Model } from 'sequelize-typescript'

/** Declare your standart of JWT payload */
export interface IJwtPayload {
  user_id: string
  type: string
  readonly exp?: number
  readonly iat?: number
}

/** Construct all property from the given interface of attributes to generate a type for service function of fetching a data from mongoDB. */
export type TQueryFindParams<T> = Partial<
  {
    _mode: (typeof _TModeAttributes)[number]
    _page: number
    _pageSize: number
    _activeOnly?: 'Y' | 'N'
  } & { [P in keyof T]: string | number | number[] | string[] | null }
>

export interface IReturnGetSomeData<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export type TPureUAParser = {
  browser: { name: string; version: string }
  engine: { name: string; version: string }
  os: { name: string; version: string }
  device: { vendor?: string; model?: string; type?: string }
  cpu: { architecture?: string }
}

export interface IMicroAuthPayload {
  user_name: string | null
  app_code: string | null
  periode: string | null
  session_id: string | null
  app_list: Array<string>
}

export type IRequestPayloads = {
  id: string
  at: number
  validations: any
  micro_auth?: IMicroAuthPayload | null 
  user_auth?: IJwtPayload | null
  client_informations?: {
    [P in keyof (TPureUAParser & { ip_addr: string })]+?: string
  }
}

export interface IPayloadResponse {
  message: string
  detailMessage?: string
  data?: any
  page?: number
  pageSize?: number
  total?: number
}

interface ICustomResponse {
  asJson: (
    statusCode: number,
    payloadResponse: IPayloadResponse,
    logData?: Object | null
  ) => void
}

/**
 * mf: the main field, which consuming whole of property in a document.
 * bf: the inherit field from mf, with excluding all the private property that only fetch in cycle of server side.
 * mnf: the minified property, which is only consuming the simply informations.
 */
const _TModeAttributes = ['mf', 'bf', 'mnf', 'lov'] as const

export type TModeAttributes = (typeof _TModeAttributes)[number] & unknown

/** Construct all property from the given interface of attributes */
export type TAttributes<T> = {
  [P in (typeof _TModeAttributes)[number]]+?: Array<(keyof T) | [(keyof T) | any, string]>
}

export interface Response extends Resp, ICustomResponse {}
export interface Request extends Reqs, IRequestPayloads {}

export type TransposeClassDTO<T> = { [P in keyof T]: T[P] }
