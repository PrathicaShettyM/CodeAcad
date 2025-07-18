import nodemailer from "nodemailer";

const sendEmail = async function (email, subject, message) {
    let transporter = nodemailer.createTransport({
        service: process.env.SMTP_HOST,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        logger: true, 
        debug: true
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL, // sender address (from the lms)
        to: email, // user email (to the leaners)
        subject: subject, // Subject line
        html: message, // html body
    });
};

export default sendEmail;