export const sendEmail = async (to: string, subject: string, html: string) => {
    // In a real app, use Nodemailer or Resend
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`)
    console.log(`[BODY]: ${html}`)
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500))
    
    return { success: true }
}

export const sendWhatsApp = async (phone: string, message: string) => {
    // Integration with Twilio / WPPConnect
    console.log(`[MOCK WHATSAPP] To: ${phone} | Msg: ${message}`)
     
    return { success: true }
}
