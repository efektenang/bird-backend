import { RequestMethod } from '@nestjs/common'
import * as request from 'supertest'
import * as fs from 'fs'
import { TQueryFindParams } from './helper-type.util'

// get property of enum Request Method
export type TRequestMethod = keyof { [Px in keyof typeof RequestMethod]: true }

export type IRequestMockCallback = <Q, DTO = {}> (props: IPropRequestMock<Q, DTO>) => request.Test | Promise<request.Test>


export interface IPropRequestMock<Q, DTO> {
  method: TRequestMethod
  target: string,
  query?: TQueryFindParams<Q>,
  body?: DTO,
  authorization?: string,
  attachFile?: string
}

export function requestMock (httpServer: any): IRequestMockCallback {
  return <Q, DTO = {}> ({
    method, target, query = {}, body, authorization = '', attachFile = null
  }: IPropRequestMock<Q, DTO>): any => {
    let urls: string = target
    let queryString: string[] = []
    const queryParams: any = Object.keys(query)
    
    for(let a in queryParams) {
      const keys = queryParams[a]
      queryString.push(`${keys}=${query[keys]}`)
    }

    if(queryParams.length > 0 && urls[urls.length - 1] !== '?') target += '?'
    target += queryString.join('&')

    const xhttp = (request(httpServer)[method.toString().toLocaleLowerCase()](target) as request.Test)
      .set('authorization', `${process.env['AFX_BEARER']} ${authorization}`)
      
    if(attachFile) {
      return new Promise((resolve, reject) => {
        fs.readFile(attachFile, ((err, bufferFile) => {
          if(err) reject(err)
          resolve(xhttp.attach('file_uploaded', bufferFile, 'test.png'))
        }))
      }) 
    }
    
    return xhttp
      .send((body as any || {}))
  }
}