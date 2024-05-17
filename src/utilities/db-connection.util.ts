import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Collection, Connection, Model } from 'mongoose';

export type TGetCollection = <T>(collections: string) => Collection<T>

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  private getDbHandle(): Connection {
    return this.connection;
  }

  public getCollection<T>(collections: string): Collection<T> {
    return this.connection.collection(collections)
  }
}