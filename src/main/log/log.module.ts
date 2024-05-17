import { Module } from "@nestjs/common";
import { LogService } from "./log.service";
import { MongooseModule } from "@nestjs/mongoose";
import { LogsShcema } from "@schemas/logs.schema";
import { LogController } from "./log.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
              name: 'logs_endpoint',
              schema: LogsShcema,
            },
          ]),
    ],
    controllers: [LogController],
    providers: [LogService]
})

export class LogModule {}