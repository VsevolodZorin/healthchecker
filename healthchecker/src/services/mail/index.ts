import * as nodemailer from 'nodemailer';
import { config } from 'src/config';
import { IMailConfig } from 'src/types/mail.interface';

class MailService {
  transporter: nodemailer.Transporter;
  config: IMailConfig;

  constructor(config: IMailConfig) {
    this.config = config;
    // const user = config.smtpUser;
    // const pass = config.smtpPasswors;
    // const transport = `smtps://${user}:${pass}@smtp.gmail.com`;
    // this.transporter = nodemailer.createTransport(transport);

    // this.transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: this.config.smtpUser,
    //     pass: this.config.smtpPasswors,
    //   },
    // });

    this.transporter = nodemailer.createTransport({
      host: this.config.smtpHost,
      port: this.config.smtpPort,
      secure: false,
      auth: {
        user: this.config.smtpUser,
        pass: this.config.smtpPasswors,
      },
    });
  }

  sendMail = async (to: string) => {
    // todo add templates

    await this.transporter.sendMail(
      {
        from: this.config.smtpUser,
        to,
        subject: `notification from mailService`,
        text: '',
        html: `
        <div>
            <h3>test message</h3>
        </div>
    `,
      },
      (error: Error | null): void =>
        !!error && console.log('--- mail catch', error),
    );
  };
}

export const mailService = new MailService(config.mail);
