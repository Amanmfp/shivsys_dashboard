import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error setting up email transporter:', error);
    } else {
        console.log('Email transporter is set up and ready to send emails.');
    }
});

export default transporter;
