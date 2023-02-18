import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  AuthCredentialsDto,
  GoogleAuthCredentialDto,
} from './dto/auth-credentials.dto';
import { User, UserDocument } from './schema/user.schema';
import { JwtPayload } from './jwt-payload.interface';
import { AuthUpdateCredentialsDto } from './aut-update-user-credentials.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  // GET ALL USER Admin
  async getAllUsers(): Promise<User[]> {
    // get alll users except where user is admin
    return await this.userModel.find({ roles: { $ne: 'admin' } }).exec();
  }

  // GET USER BY ID Admin
  async getUserById(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  // UPDATE USER
  async updateUser(updateUserDto: AuthUpdateCredentialsDto, me: any) {
    const { email, firstname, lastname, password, phone } = updateUserDto;

    const user = await this.userModel.findById(me._id).exec();
    if (user) {
      if (password) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
      }
      user.firstname = firstname || user.firstname;
      user.lastname = lastname || user.lastname;
      user.phone = phone || user.phone;
      user.email = email || user.email;
      try {
        return await user.save();
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    } else {
      throw new UnauthorizedException('User with that id not found');
    }
  }

  //CREATE USER | Register
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { email, firstname, lastname, password, phone } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new this.userModel({
      firstname,
      lastname,
      phone,
      email,
      password: hashedPassword,
    });

    try {
      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  // DELETE USER Admin
  async deleteUser(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  //   Login / Sign in
  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }

  //FIND USER BY EMAIL
  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }
  //CREATE USER WITH GOOGLE AUTH
  async createUserWithGoogle(
    firstName: string,
    lastName: string,
    email: string,
    profile: string,
    sub: string,
  ): Promise<User> {
    const user = new this.userModel({
      firstName,
      lastName,
      email,
      sub,
      profile,
    });
    try {
      return await user.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new Error('User already exists');
      } else {
        throw new InternalServerErrorException(err);
      }
    }
  }

  //LOGIN USER WITH GOOGLE AUTH
  async signInWithGoogle(
    googleAuthCredentialDto: GoogleAuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { family_name, given_name, email, sub, picture, email_verified } =
      googleAuthCredentialDto;
    if (email_verified) {
      const user = await this.findUserByEmail(email);
      if (user) {
        const payload: JwtPayload = { email: user.email };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
      } else {
        const user = await this.createUserWithGoogle(
          family_name,
          given_name,
          email,
          sub,
          picture,
        );
        const payload: JwtPayload = { email: user.email };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
      }
    } else {
      throw new InternalServerErrorException("Votre e-mail n'est pas vérifié!");
    }
  }

  // FIND USER
  async findUser(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }
  // FORGOT PASSWORD
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user) {
      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      user.resetPasswordExpiration = new Date(Date.now() + 10 * 60 * 1000);

      await user.save({ validateBeforeSave: false });
      try {
        await this.mailService.sendUserConfirmation(user, resetToken);
        return { message: 'Email Sent successfully' };
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    } else {
      throw new UnauthorizedException('User with that email not found');
    }
  }
  // RESET PASSWORD
  async resetPassword(resetToken: string, password: string): Promise<User> {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await this.userModel
      .findOne({
        resetPasswordToken,
        resetPasswordExpiration: {
          $gt: new Date(),
        },
      })
      .exec();

    if (user) {
      if (user.resetPasswordExpiration.getTime() > Date.now()) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiration = undefined;

        try {
          return await user.save();
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
      } else {
        throw new UnauthorizedException('Reset token has expired');
      }
    } else {
      throw new UnauthorizedException('Invalid reset token');
    }
  }

  // SEND MESSAGE
  async sendMessage(
    messages: string,
    email: string,
    subject: string,
    name: string,
  ): Promise<any> {
    try {
      return await this.mailService.sendMessage(messages, email, subject, name);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
