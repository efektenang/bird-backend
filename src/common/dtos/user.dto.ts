import { IsEmailUserAlreadyExist } from "@utilities/email-exists.validator";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";

enum Role {
  SERVER = "SERVER",
  CLIENT = "CLIENT",
}

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{8,32}$/g,
    {
      message:
        "Password must contains at least 1 lowercase, uppercase, number and special characters, with the length password in 8-32 characters.",
    }
  )
  newPassword: string;
}

export class UpdateBasicInfoDTO {
  @IsString()
  @IsOptional()
  user_name?: string;

  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsString()
  @IsOptional()
  full_name?: string;

  @IsEmail()
  @IsEmailUserAlreadyExist({
    message: "Email is already exists. Use another email to register.",
  })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&_]{8,32}$/g,
    {
      message:
        "Password must contains at least 1 lowercase, uppercase, number and special characters, with the length password in 8-32 characters.",
    }
  )
  password: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(Role)
  role_user: string;
}
