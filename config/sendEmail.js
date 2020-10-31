const nodemailer =require('nodemailer')
const sendEmail= async function (options) {
    let transport = nodemailer.createTransport({
        host: process.env.SENT_EMAIL_HOST,
        port: process.env.SENT_EMAIL_PORT,
        auth: {
            user: process.env.SENT_EMAIL,
            pass: process.env.SENT_EMAIL_PASSWPRD
        }
    })
    let mailOptions = ({
        from: `${process.env.SENTEMAIL}`,
        to:options.email,
        subject:options.subject,
        html:options.html
    })
    await transport.sendMail(mailOptions, function (error,info) {
        if(error){
            console.log('Email is Not Send',error)
        }else {
            console.log('Email sent: ' + info.response);
        }
        
    })
    
}
module.exports =sendEmail