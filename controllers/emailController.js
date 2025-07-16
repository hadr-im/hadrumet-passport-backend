const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');

async function sendEmail(appID, password, email, name){    
    const templatePath = path.join(__dirname, 'emailTemplate.html');
    const source = fs.readFileSync(templatePath, 'utf8').toString();
    const template = handlebars.compile(source);

    const replacements = {
        name : name,
        appID : appID,
        password : password
    }
    const htmlToSend = template(replacements);

    const auth = {
        type: "OAUTH2",
        user:process.env.EMAIL_ADDRESS,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: auth
    });

    const mailConfig = {
        from : {
            name: process.env.EMAIL_NAME,
            address : process.env.EMAIL_ADDRESS,
        },
        to : "rachdioussama33@gmail.com",// process.env.EMAIL_RECEIVER,
        subject: `Credentials for ${name}`,
        html: htmlToSend
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailConfig, (error, info) => {
            if (error){
                console.error('Error sending email:', error);
                return reject({message: "An error occurred while sending the email.", error: error.message});
            }
            return resolve({message: "Email sent successfully!", info: info});
        })
    })
}

module.exports = {
    sendEmail
}
