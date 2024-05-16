import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export interface UserAgent {
  ua: string;
  browser: any;
  engine: any;
  os: any;
  device: any;
  cpu: any;
}

export type LogsDocument = HydratedDocument<Logs>;

@Schema({ collection: "logs_endpoint" })
export class Logs {
  @Prop({ required: true })
  host: string;

  @Prop({ default: null })
  log_id: string;

  @Prop({ default: null })
  time: Date;

  @Prop({ required: true })
  path: string;

  @Prop({ default: null })
  method: string;

  @Prop({ default: null })
  ip: string;
    
  @Prop({ type: Object })
  user_agent: UserAgent;
}

export const LogsShcema = SchemaFactory.createForClass(Logs);
