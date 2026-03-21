export async function sendEmail({ to, subject, html }) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL;

    if (!apiKey) {
        throw new Error("BREVO_API_KEY is missing in environment variables.");
    }

    if (!senderEmail) {
        throw new Error("SENDER_EMAIL is missing in environment variables.");
    }

    const payload = {
        sender: { email: senderEmail },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
    };

    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Failed to send email ❌:", data);
            throw new Error(`Brevo API Error: ${data.message || response.statusText}`);
        }

        console.log("Email sent successfully ✅:", data.messageId);
        return data;
    } catch (error) {
        console.error("Failed to send email ❌:", error);
        throw error;
    }
}