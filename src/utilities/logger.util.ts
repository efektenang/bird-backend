import { LoggerService } from "@nestjs/common";


function createMessage (code, message, color = 30) {
  console.log(`\x1b[${color}m\x1b[1m[${code}]\x1b[0m\x1b[${color}m`, `\x1b[37m${message}`, '\x1b[0m')
}

export class MainLogger implements LoggerService {
  
  log(message: any, ...optionalParams: any[]) {
    // if (process.env['NEST_ENV'] !== 'prod') createMessage('LOG', message, 32)
  }

  error(message: any, ...optionalParams: any[]) {
    createMessage('ERR', message, 31)
  }

  warn(message: any, ...optionalParams: any[]) {
    if (process.env['NEST_ENV'] !== 'prod') createMessage('WARN', message, 33)
  }

  debug?(message: any, ...optionalParams: any[]) {
    createMessage('DEBG', message, 94)
  }

  verbose?(message: any, ...optionalParams: any[]) {
    createMessage('VERB', message, 35)
  }
}