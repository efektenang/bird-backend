import { Module } from "@nestjs/common";
import { IsEmailUserAlreadyExistConstraint } from "@utilities/email-exists.validator";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaService } from "src/prisma.service";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService, IsEmailUserAlreadyExistConstraint],
})
export class UserModule {}
