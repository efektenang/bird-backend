import { HttpStatus, NestMiddleware } from '@nestjs/common'
import { NextFunction } from 'express'
import { IJwtPayload, Request, Response } from '@utilities/helper-type.util'

export declare type TExecValidateRequest = {
  desc: string
  code?: string
  name?: string
}

export default class ProtectMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const validations = req.validations as FX_ROUTERS.TCombineOptValidate
    try {
      if (typeof validations.protect === 'function') {
        return await validations.protect<IJwtPayload, Request>(
          { authPayload: req.user_auth, requestPayload: req },
          next
        )
      }
      return next()
    } catch (er) {
      res.asJson(HttpStatus.FORBIDDEN, { message: er.message })
    }
  }
}
