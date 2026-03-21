import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify()
    .then(() => console.log("Email service is ready to send emails ✅"))
    .catch((err) => {
        console.error("Email Service Verification Error ❌");
        console.error("Message:", err.message);
        console.error("Full error:", err);
    });

export async function sendEmail({ to, subject, html }) {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully ✅:", info.messageId);
        return info;
    } catch (error) {
        console.error("Failed to send email ❌:", error);
        throw error;
    }
}