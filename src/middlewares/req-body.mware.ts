import { HttpStatus, NestMiddleware } from '@nestjs/common'
import { NextFunction } from 'express'
import { Request, Response } from '@utilities/helper-type.util'

export declare type TExecValidateRequest = {
  desc: string
  code?: string
  name?: string
}

export default class ValidateRequestBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const registryTemplate = req.validations as FX_ROUTERS.TCombineOptValidate
    try {
      if (
        typeof registryTemplate.maxBodySize === 'number' &&
        registryTemplate.maxBodySize > 0
      ) {
        const incomingSize = +(
          new TextEncoder().encode(JSON.stringify(req.body || {})).length /
          1024.0 /
          1024.0
        ).toFixed(5)
        if (incomingSize > registryTemplate.maxBodySize) {
          throw new Error(`Out of limit the Data Body of ${incomingSize} MB`)
        }
      }
      next()
    } catch (er) {
      res.asJson(HttpStatus.PAYLOAD_TOO_LARGE, { message: er.message })
    }
  }
}
