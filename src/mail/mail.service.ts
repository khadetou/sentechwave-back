import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/schema/user.schema';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `http://localhost:3000/reset/${token}`;
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Confirmez votre address email',
      template: 'confirmation',
      context: {
        url: url,
        lastname: user.lastname,
        firstname: user.firstname,
      },
    });
  }

  async sendMessage(
    messages: string,
    email: string,
    subject: string,
    name: string,
  ) {
    try {
      const data = await this.mailService.sendMail({
        from: email,
        to: 'hotcodesagency@gmail.com',
        subject: subject,
        template: 'transactional',
        context: {
          messages,
          email,
          name,
        },
      });
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async newOrder(_id: any) {
    try {
      return await this.mailService.sendMail({
        from: 'khadetou96@gmail.com',
        to: 'khadetou96@gmail.com',
        template: 'clientsorder',
        context: {
          _id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
