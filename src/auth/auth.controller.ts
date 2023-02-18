import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUpdateCredentialsDto } from './aut-update-user-credentials.dto';
import { AuthService } from './auth.service';
import {
  AuthCredentialsDto,
  GoogleAuthCredentialDto,
} from './dto/auth-credentials.dto';
import { GetUser } from './get-user-decoration';
import { Roles } from './roles/role.decorator';
import { Role } from './roles/role.enum';
import { RolesGuard } from './roles/roles.guard';
import { User } from './schema/user.schema';
import { OAuth2Client } from 'google-auth-library';
import { clearConfigCache } from 'prettier';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // GET USER
  @Get('/user')
  @UseGuards(AuthGuard(), RolesGuard)
  async getUser(@GetUser() user: User): Promise<User> {
    return user;
  }

  // GET ALL USERS
  @Get('users')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  // FORGOT PASSWORD
  @Post('/forgot-password')
  async forgotPassword(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    return await this.authService.forgotPassword(email);
  }

  // CONFIRM NEW PASSWORD
  @Put('/confirm-email/:token')
  async resePassword(
    @Body('password') password: string,
    @Param('token') token: string,
  ): Promise<User> {
    return await this.authService.resetPassword(token, password);
  }

  // Get user by Id
  @Get('users/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.authService.getUserById(id);
  }

  // UPDATE USER
  @Put('user/profile')
  @UseGuards(AuthGuard())
  async updateUser(
    @GetUser() user: User,

    @Body() authUpdateCredentialsDto: AuthUpdateCredentialsDto,
  ): Promise<User> {
    return this.authService.updateUser(authUpdateCredentialsDto, user);
  }

  // DELETE USER
  @Delete('users/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async deletUser(@Param('id') id: string): Promise<User> {
    return this.authService.deleteUser(id);
  }

  // SIGN IN
  @Post('/signin')
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(email, password);
  }

  // SIN UP | REGISTER
  @Post('/signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.authService.createUser(authCredentialsDto);
  }

  // GOOGLE SIGN IN / REGISTER
  @Post('/login')
  async login(
    @Body() googleAuthCredentialDto: GoogleAuthCredentialDto,
  ): Promise<any> {
    return await this.authService.signInWithGoogle(googleAuthCredentialDto);
  }

  // SEND MESSAGE
  @Post('/send-message')
  async sendMessage(
    @Body('messages') messages: string,
    @Body('email') email: string,
    @Body('subject') subject: string,
    @Body('name') name: string,
  ): Promise<string> {
    return this.authService.sendMessage(messages, email, subject, name);
  }
}
