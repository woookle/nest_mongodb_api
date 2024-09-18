import { IsEmail, IsString } from "class-validator";

export class AuthCredentialsDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string
}