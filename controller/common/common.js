const brevo = require('@getbrevo/brevo');
exports.sendMail = (subject,htmlContent,recipientEmail,recipientName) => {

    let apiInstance = new brevo.TransactionalEmailsApi();

    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.apiKey;

    let sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { "name": process.env.senderName, "email": process.env.senderEmail };
    sendSmtpEmail.to = [
      { "email": recipientEmail, "name": recipientName }
    ];
    return new Promise((resolve, reject) => {
        apiInstance.sendTransacEmail(sendSmtpEmail)
        .then(function (data) {
          console.log('Email sent successfully:', data.body.messageId);
          resolve({status:true,messageId:data.body.messageId})
        })
        .catch(function (error) {
            console.error('Error sending email:', error);
            resolve({status:false})
        });
    })
 
}