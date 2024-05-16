import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
  UpdateBasicInfoDTO,
} from "@dtos/user.dto";
import { Request, Response } from "@utilities/helper-type.util";
import { RolesGuard } from "./roles/roles.guard";
import { Role, Roles } from "./roles/roles.decorator";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Server)
  async getAllUser(@Res() res: Response) {
    return this.userService
      .findAllUsers()
      .then((result) =>
        res.asJson(HttpStatus.OK, {
          message: "OK",
          data: result,
        })
      )
      .catch((err) =>
        res.asJson(
          HttpStatus.BAD_REQUEST,
          { message: "[GET-USER] Authentication required" },
          { message: err.message }
        )
      );
  }

  @Get(":userId")
  @UseGuards(RolesGuard)
  @Roles(Role.Server)
  async getCurrentUserInfo(
    @Param("userId") params: string,
    @Res() res: Response
  ) {
    return this.userService
      .findUserIfExists(params)
      .then((result) =>
        res.asJson(HttpStatus.OK, { message: "OK", data: result })
      )
      .catch((err: any) =>
        res.asJson(HttpStatus.BAD_REQUEST, { message: err.message })
      );
  }

  @Post("login")
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    return this.userService
      .login(body)
      .then((result) =>
        res.asJson(HttpStatus.OK, {
          message: "OK",
          data: result,
        })
      )
      .catch((err) =>
        res.asJson(
          HttpStatus.BAD_REQUEST,
          { message: "[POST-LOGIN] Failed to sign in account." },
          { message: err.message }
        )
      );
  }

  @Post("register")
  @UseGuards(RolesGuard)
  @Roles(Role.Server)
  async register(@Body() body: RegisterUserDto, @Res() res: Response) {
    return this.userService
      .registerUser(body)
      .then((result) => {
        res.asJson(HttpStatus.OK, {
          message: "OK",
          data: result,
        });
      })
      .catch((er) => {
        res.asJson(
          HttpStatus.BAD_REQUEST,
          { message: "[POST-REG] Failed to register account." },
          { message: er.message }
        );
      });
  }

  @Post("change-password")
  async changePasswordUser(
    @Body() body: ChangePasswordDto,
    @Res() res: Response,
    @Req() req: Request
  ) {
    return this.userService
      .changePassword(req.user_auth.user_id, body)
      .then((result) =>
        res.asJson(HttpStatus.OK, { message: "OK", data: result })
      )
      .catch((err) =>
        res.asJson(HttpStatus.BAD_REQUEST, { message: err.message })
      );
  }

  @Post("update")
  async updateUser(
    @Body() body: UpdateBasicInfoDTO,
    @Res() res: Response,
    @Req() req: Request
  ) {
    return this.userService
      .updateBasicInfo(req.user_auth.user_id, body)
      .then((result) =>
        res.asJson(HttpStatus.OK, {
          message: "OK",
          data: result,
        })
      )
      .catch((err) =>
        res.asJson(HttpStatus.BAD_REQUEST, { message: err.message })
      );
  }
}
