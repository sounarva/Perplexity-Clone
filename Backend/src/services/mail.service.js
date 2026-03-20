import nodemailer from "nodemailer"
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         type: 'OAuth2',
//         user: process.env.GOOGLE_USER,
//         clientId: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// })

// transporter.verify()
//     .then(() => console.log("Email service is ready to send emails ✅"))
//     .catch((err) => {
//         console.error("Email Service Verification Error ❌");
//         console.error("Message:", err.message);
//         console.error("Check your GOOGLE_REFRESH_TOKEN and OAuth2 settings.");
//     })

export async function sendEmail({ to, subject, html, text }) {
    try {
        // const mailOptions = {
        //     from: process.env.GOOGLE_USER,
        //     to,
        //     subject,
        //     html,
        // };

        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to,
            subject,
            html,
        });

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