import { NextFunction } from 'express'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MainLogger } from '@utilities/logger.util'
import * as morgan from 'morgan'
import { Request } from '@utilities/helper-type.util'
import { ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'

const methodColors = {
  GET: 92,
  POST: 94,
  PUT: 94,
  PATCH: 95,
  DELETE: 91,
  ALL: 37
}

const boolColors = {
  NO: 91,
  YES: 92
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new MainLogger()
  })

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true
  })

  if (process.env.NEST_ENV === 'dev') {
    // mongoose.set('debug', false)
  }

  app.use(
    morgan((tokens, req: Request, res) => {
      let method, pathUrl, reqAt, reqID, logging, resStatus, responseTime, auths
      try {
        method = tokens['method'](req, res)
        pathUrl = tokens['pathUrls'](req, res)
        reqAt = tokens['at'](req, res)
        reqID = tokens['id'](req, res)
        logging = tokens['logging'](req, res)
        auths = tokens['auth'](req, res)
        logging = `\x1b[1m\x1b[${boolColors[logging]}m${logging}\x1b[0m`
        auths = `\x1b[1m\x1b[${boolColors[auths]}m${auths}\x1b[0m`
        resStatus = tokens['status'](req, res)
        responseTime = (+tokens['response-time'](req, res) / 1000).toFixed(3)
      } catch {
        // no action
      }

      return (
        `\n\x1b[${
          methodColors[method] || 37
        }m\x1b[1m[${method}] ${pathUrl} :\x1b[0m\x1b[37m` +
        `\n\x1b[${
          methodColors[method] || 37
        }m\x1b[1m|-\x1b[0m ID              : ${reqID}` +
        `\n\x1b[${
          methodColors[method] || 37
        }m\x1b[1m|-\x1b[0m Resp. Status    : ${resStatus}` +
        `\n\x1b[${
          methodColors[method] || 37
        }m\x1b[1m|-\x1b[0m Uptime          : ${responseTime} sec` +
        `\n\x1b[${
          methodColors[method] || 37
        }m\x1b[1m|-\x1b[0m Date            : ${reqAt}` +
        `\n\x1b[${
          methodColors[method] || 37
        }m\x1b[1m|-\x1b[0m Logging         : ${logging}` +
        `\n\x1b[${
          methodColors[method] || 37
        }m\x1b[1m|-\x1b[0m Auth            : ${auths}`
      )
    })
  )

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
      validationError: { target: true, value: true }
    })
  )

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
