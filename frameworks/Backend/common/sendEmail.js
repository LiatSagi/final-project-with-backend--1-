const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

transporter.use(
  "compile",
  hbs({
    viewEngine: "express-handlebars",
    viewPath: "./common/views/",
  })
);

async function sendEmail(email) {
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Signup Successful!</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              h1 {
                  color: #007bff;
              }
              p {
                  font-size: 16px;
                  line-height: 1.6;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Welcome to Instant Giving!</h1>
              <p>Dear User,</p>
              <p><strong>You have successfully signed up for our service!</strong></p>
              <p>We are excited to have you on board. Thank you for joining Instant Giving.</p>
              <p>Best regards,<br>Instant Giving Team</p>
          </div>
      </body>
      </html>
  `;

  try {
    await transporter.sendMail({
      to: email,
      from: "instantgivingproject@gmail.com",
      subject: "Signup succeeded!",
      html: htmlContent,
    });
    console.log(`Email sent successfully to ${email}`);
    return 1;
  } catch (error) {
    return 0;
  }
}
async function sendResetEmail(email, token) {
  console.log(email);
  console.log(token);
  try {
    await transporter.sendMail({
      to: email,
      from: "instantgivingproject@gmail.com",
      subject: "איפוס סיסמה",
      html: `
    <div dir="rtl" style="font-family: 'Arial', sans-serif;  text-align: center; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #007bff; text-align: center;">בקשת איפוס סיסמה</h2>
    <p style="font-size: 18px;">שלום,</p>
    <p style="font-size: 18px;">קיבלנו בקשה לאיפוס הסיסמה שלך.</p>
    <p style="font-size: 18px;">לחץ על הלינק הבא כדי לאפס את הסיסמה שלך:</p>
    <a href="http://localhost:3000/user/changePassword/${token}" style="display: inline-block; background-color: #007bff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; text-align: center; margin-top: 20px;">אפס סיסמה</a>
    <p style="font-size: 16px; margin-top: 20px; color: #555;">אם אינך מזהה את בקשה זו, ניתן להתעלם מהודעה זו</p>
  </div>
  `,
    });
    return 1;
  } catch (error) {
    return 0;
  }
}

// Function to send an email when a user's donation is accepted
function sendAcceptedEmail(email) {
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Donation Accepted!</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              h1 {
                  color: #007bff;
              }
              p {
                  font-size: 16px;
                  line-height: 1.6;
              }
          </style>
      </head>
      <body>
           <div class="container" style="font-family: 'Arial', sans-serif;  text-align: center; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);" dir="rtl">
            <h1>הבקשה שלך לתרומה אושרה!</h1>
            <p>לקוח יקר,</p>
            <p>אנו שמחים להודיע לך כי בקשתך לתרומה אושרה על ידי הצוות שלנו.
              מעתה הבקשה שלך פעילה וניתן לתרום לך.</p>
            <p> אם יש לך שאלות נוספות אתה מוזמן ליצור איתנו קשר או להסתכל בחלק של מידע נוסף באתר</p>
            <p>בברכה,<br>Instant Giving</p>
           </div>
      </body>
      </html>
  `;
  transporter.sendMail({
    to: email,
    from: "instantgivingproject@gmail.com",
    subject: "Donation Accepted!",
    html: htmlContent,
  });
}

// Function to send an email when a user's donation is rejected
async function sendRejectedEmail(email) {
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Donation Rejected!</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              h1 {
                  color: #dc3545;
              }
              p {
                  font-size: 16px;
                  line-height: 1.6;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>התרומה שלך נדחתה</h1>
              <p> לקוח יקר, </p>
              <p> אנו מתנצלים לבשר כי התרומה שלך נדחתה. אם יש לך שאלות או דאגות, אנא פנה אלינו. </p>
              <p> בברכה,<br>Instant Giving</p>
          </div>
      </body>
      </html>
  `;

  try {
    await transporter.sendMail({
      to: email,
      from: "instantgivingproject@gmail.com",
      subject: "התרומה נדחתה",
      html: htmlContent,
    });
    console.log(`Email sent successfully to ${email}`);
    return 1;
  } catch (error) {
    return 0;
  }
}

async function sendAcceptedOrginizationEmail(email) {
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Orginization Accepted!</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              h1 {
                  color: #dc3545;
              }
              p {
                  font-size: 16px;
                  line-height: 1.6;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Your Donation Was Rejected</h1>
              <p>Dear Donor,</p>
              <p>We are pleased to inform you that your orginization has been accepted. Thank you for joining our website!</p>
              <p>Best regards,<br>Instant Giving Team</p>
          </div>
      </body>
      </html>
  `;

  try {
    await transporter.sendMail({
      to: email,
      from: "instantgivingproject@gmail.com",
      subject: "התרומה נדחתה",
      html: htmlContent,
    });
    console.log(`Email sent successfully to ${email}`);
    return 1;
  } catch (error) {
    return 0;
  }
}

function sendOrganizationEmail(email, emailSubject, text) {
  var mailOptions = {
    from: senderEmail,
    to: email,
    subject: emailSubject,
    text: `${text}`,
    template: "index",
    context: {
      emailText: text,
    },
  };
  transporterOrganizationEmails.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = {
  sendEmail,
  sendResetEmail,
  sendAcceptedEmail,
  sendRejectedEmail,
  sendOrganizationEmail,
  sendAcceptedOrginizationEmail,
};
