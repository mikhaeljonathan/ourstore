import nodemailer from "nodemailer";

export default class Email {
    constructor(user) {
        this.to = user.email;
        this.from = `Admin <${process.env.EMAIL_FROM || 'ourstore@skripsipastia.xyz'}>`
    }

    newTransport() {
        // if (process.env.NODE_ENV === 'production') {
        //     // Sendgrid
        //     return nodemailer.createTransport({
        //         service: 'gmail',
        //         auth: {
        //             user: process.env.GMAIL_EMAIL,
        //             pass: process.env.GMAIL_PASS
        //         }
        //     });
        // }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
            port: process.env.EMAIL_PORT || 2525,
            auth: {
                user: process.env.EMAIL_USERNAME || '466d36c4147d48',
                pass: process.env.EMAIL_PASSWORD || 'be1f8883f78f31'
            }
        });
    }

    async send(subject, message) {

        // define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: message,
            // html: 
        };

        // create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendPasswordReset(url) {
        await this.send('Your password reset token (valid for 10 mins)',
            `Forgot your password? Go to this page: ${url}.\n If you didn't forget your password, please ignore this email!`);
    }

    async sendOTP(OTP) {
        await this.send('Your OTP', `Here is your OTP: ${OTP}`);
    }
}
