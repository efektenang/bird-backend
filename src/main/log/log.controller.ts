import { Controller, Get, HttpStatus, Query, Res } from "@nestjs/common";
import { LogService } from "./log.service";
import { Response } from "@utilities/helper-type.util";

@Controller()
export class LogController {
    constructor(private readonly logService: LogService) { }
    
    @Get()
    async getAllLogs(@Res() res: Response, @Query() query) {
      return this.logService
        .getEndpointLogs(query)
        .then((result) =>
          res.asJson(HttpStatus.OK, { message: "OK", data: result })
        )
        .catch((err: any) =>
          res.asJson(HttpStatus.BAD_REQUEST, { message: err.message })
        );
    }
}