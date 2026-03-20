import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
})

transporter.verify()
    .then(() => console.log("Email service is ready to send emails ✅"))
    .catch((err) => {
        console.error("Email Service Verification Error ❌");
        console.error("Message:", err.message);
        console.error("Check your GOOGLE_REFRESH_TOKEN and OAuth2 settings.");
    })

export async function sendEmail({ to, subject, html, text }) {
    try {
        const mailOptions = {
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text
        };

        const details = await transporter.sendMail(mailOptions);
        // console.log("Email sent successfully ✅:", details);
    } catch (error) {
        console.error("Failed to send email ❌:", error.message);
        throw error;
    }
}