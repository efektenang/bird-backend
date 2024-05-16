import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { IJwtCustom, JwtCustom } from "@utilities/token-generator.util";
import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
  UpdateBasicInfoDTO,
} from "@dtos/user.dto";
import * as encryptions from "@utilities/encryption.util";
import shortUniqueId from "short-unique-id";
import { IUsers } from "@interfaces/user.interface";
import { v4 as uuidv4 } from "uuid";
import { PrismaService } from "src/prisma.service";

@Injectable()
@JwtCustom("jwtCustom")
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private jwtCustom: IJwtCustom;

  async findOneUsers(email: string): Promise<IUsers> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    return user;
  }

  async findUserIfExists(userId: string): Promise<IUsers> {
    try {
      const currentUser = await this.prisma.user.findFirst({
        where: { user_id: userId },
      });

      if (!currentUser) throw new NotFoundException("User not found!");

      return currentUser;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async findAllUsers() {
    try {
      const res = await this.prisma.user.findMany({
        select: {
          user_id: true,
          user_name: true,
          full_name: true,
          email: true,
          phone: true,
          role_user: true
        },
      });

      return res;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async login(data: LoginUserDto): Promise<{token: string}> {
    try {
      const exists = await this.findOneUsers(data.email);

      if (!exists) {
        throw new Error("Wrong Password or Email");
      }

      const [_hash, _salt] = exists.password.split(" ");
      const newEnc = encryptions.hashing(data.password, _salt);

      if (newEnc.hash !== _hash)
        throw new UnauthorizedException("Wrong Password or Email");

      let license: any = new shortUniqueId({ length: 24 }).rnd();
      license = license.match(/.{2,6}/g).join("-");

      const token: string = await this.jwtCustom.generateToken({
        user_id: exists.user_id,
        type: exists.role_user,
      });

      return { token };
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async registerUser(data: RegisterUserDto) {
    try {
      const hashPassword = encryptions.encryptPassword(data.password);
      const saveUser = await this.prisma.user.create({
        data: {
          ...data,
          user_id: uuidv4(),
          password: [hashPassword.hash, hashPassword.salt].join(" "),
          created_by: data.user_name,
        },
      });

      return saveUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    try {
      const currentUser = await this.findUserIfExists(userId);

      const [_hash, _salt] = currentUser.password.split(" ");
      const encPassword = encryptions.encryptPassword(data.newPassword);
      const newEnc = encryptions.hashing(data.oldPassword, _salt);

      if (newEnc.hash !== _hash) throw new Error("Wrong old password!");

      await this.prisma.user.update({
        where: { user_id: userId },
        data: {
          password: [encPassword.hash, encPassword.salt].join(" "),
          updated_by: currentUser.user_name,
          updated_at: new Date(),
        },
      });
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async updateBasicInfo(userId: string, data: UpdateBasicInfoDTO) {
    try {
      const user = await this.findUserIfExists(userId);

      const updateUser = await this.prisma.user.update({
        where: { user_id: userId },
        data: {
          ...data,
          updated_by: user.user_name,
          updated_at: new Date(),
        },
      });

      return updateUser;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
