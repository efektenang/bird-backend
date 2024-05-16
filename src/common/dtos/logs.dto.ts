import { UserAgent } from "@schemas/logs.schema";
import {
  IsObject,
  IsString,
} from "class-validator";

export class SaveLogsDTO {
  @IsString()
  host: string;

  @IsString()
  log_id: string;

  @IsString()
  path: string;

  @IsString()
  method: string;

  @IsString()
  ip: string;

  @IsObject()
  user_agent: UserAgent;
}
