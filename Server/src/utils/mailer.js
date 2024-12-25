const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async (email, subject, text, html) => {
    try {
        const msg = {
            to: email,
            from: process.env.VERIFIED_SENDER_EMAIL, // Your verified sender email
            subject,
            text,
            html
        }
        await sgMail.send(msg)
        return true
    } catch (error) {
        console.error('Email error:', error)
        throw new Error('Failed to send email')
    }
}

export{
    sendEmail
}
