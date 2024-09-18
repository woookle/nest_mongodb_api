import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await this.usersService.comparePasswords(password, user.password))) {
      const payload = { email: user.email, _id: user._id };
      return {
        user,
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Неверный логин или пароль');
    }
  }

  async validateUser(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Вы не зарегистрировались!');
    }
    return user.toObject();
  }
}
