if (process.env.NODE_ENV !== 'production') {

    require('dotenv').config({
        path: './config/config.env'
    })

}
const accountSid = process.env.SMS_TWILIO_ACCOUNT_SID;
const authToken = process.env.SMS_TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: '+8801608417600',
    
        to: '+8801763553147'
    })
    .then(message => console.log(message.sid));