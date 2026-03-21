import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

transporter.verify()
    .then(() => console.log("Email service is ready to send emails ✅"))
    .catch((err) => {
        console.error("Email Service Verification Error ❌");
        console.error("Message:", err.message);
    })

export async function sendEmail({ to, subject, html }) {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html,
        };

        const { data, error } = await transporter.sendMail(mailOptions);

        if (error) {
            console.error("Failed to send email ❌:", error);
            throw error;
        }

        console.log("Email sent successfully ✅:", data);
    } catch (error) {
        console.error("Failed to send email ❌:", error);
        throw error;
    }
}