export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'SaaS Boletos <onboarding@resend.dev>', // Default testing domain
                to: [to],
                subject: subject,
                html: html,
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`[EMAIL ERROR] API Response:`, data);
            return { success: false, error: data };
        }

        console.log(`[EMAIL SENT] ID: ${data.id} | To: ${to}`);
        return { success: true, data };
    } catch (error) {
        console.error(`[EMAIL ERROR] Failed to send email to ${to}:`, error);
        return { success: false, error };
    }
}

export const sendWhatsApp = async (phone: string, message: string) => {
    // Integration with Twilio / WPPConnect
    console.log(`[MOCK WHATSAPP] To: ${phone} | Msg: ${message}`)
     
    return { success: true }
}
