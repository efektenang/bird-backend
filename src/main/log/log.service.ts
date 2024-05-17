import { SaveLogsDTO } from "@dtos/logs.dto";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Logs } from "@schemas/logs.schema";
import { Model } from "mongoose";

@Injectable()
export class LogService {
  constructor(@InjectModel("logs_endpoint") private logsModel: Model<Logs>) {}

  async saveLogs(data: SaveLogsDTO, userAgent: any) {
    try {
      const logsData = new this.logsModel({
        ...data,
        time: new Date(),
        user_agent: userAgent,
      });

      return logsData.save();
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async getEndpointLogs(filters: any) {
    try {
      if (filters) {
        const match: any = {};

        if (filters.host) {
          match.host = filters.host;
        }
        if (filters.path) {
          match.path = filters.path;
        }
        if (filters.browser) {
          const filter = await this.logsModel.find({
            "user_agent.browser.name": filters.browser,
          });
          return filter;
        }

        return this.logsModel.aggregate([{ $match: match }]);
      }
      const endpointLogs = await this.logsModel.find();
      if (endpointLogs[0] === undefined) return [];

      return endpointLogs;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
