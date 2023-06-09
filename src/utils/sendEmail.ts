import nodemailer from 'nodemailer'

// async await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, text: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
  console.log("testAccount", testAccount);
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "dhfyy6v2koetsm2z@ethereal.email", // generated ethereal user
      pass: "dbhG6VrMtGFK72G7gx", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: to, // list of receivers
    subject: "Change Password", // Subject line
    text: text, // plain text body
    html: text,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
