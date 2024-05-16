import { NextFunction } from 'express'
import { IJwtPayload, Request } from './helper-type.util'

// Basic Implementation of protect routes, which is we would be validate the incoming request depends on "Admin Status".
export async function basicProtect<IJwtPayload, Request>(
  { authPayload, requestPayload },
  next: NextFunction
) {
  // if (!authPayload?.is_admin) {
  //   throw new Error('Sorry, only admin can access the routes.')
  // }
  next()
}

export async function highAccessible<IJwtPayload, Request>(
  { authPayload, requestPayload },
  next: NextFunction
) {
  // if (!authPayload?.is_admin) {
  //   throw new Error('Sorry, only admin can access the routes.')
  // }
  next()
}