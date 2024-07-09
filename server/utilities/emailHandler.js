const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASSWORD
    },
    tls: { rejectUnauthorized: false }
});

exports.sendEmail = async ({ to, subject, html }) => {
    try{
        await transporter.sendMail({
            from: `SmartTrash Cloud Platform <${process.env.SMTP_AUTH_USER}>`,
            to,
            subject,
            html
        });
    }catch(error){
        console.error('[SmartTrash Cloud] (at @services/emailHandler - sendEmail):', error);
    }
};

module.exports = exports;