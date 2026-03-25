const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Foodie Hub" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Foodie Hub – Your Culinary Adventure Awaits!";

  const text = `
Hello ${name},

Welcome to Foodie Hub! We're thrilled to have you join our vibrant community of food enthusiasts, culinary explorers, and home chefs. 

At Foodie Hub, you can:
- Discover thousands of delicious recipes from around the world.
- Order your favorite meals from local restaurants with just a few clicks.
- Share your culinary creations and get inspired by others in our community.
- Track your favorite dishes and save them for later.

We believe that food is more than just nourishment—it's an experience, a culture, and a way to connect with others. Whether you're here to try new recipes, explore trending restaurants, or simply satisfy your cravings, Foodie Hub is your go-to destination for everything food-related.

To get started, visit your dashboard and personalize your food preferences so we can recommend the best meals and recipes tailored just for you.

We're excited to have you on this culinary journey and can't wait to see what you discover and create!

Bon appétit,
The Foodie Hub Team
`;

  const html = `
<p>Hello ${name},</p>

<p>Welcome to <strong>Foodie Hub</strong>! We're thrilled to have you join our vibrant community of food enthusiasts, culinary explorers, and home chefs.</p>

<p>At Foodie Hub, you can:</p>
<ul>
  <li>Discover thousands of delicious recipes from around the world.</li>
  <li>Order your favorite meals from local restaurants with just a few clicks.</li>
  <li>Share your culinary creations and get inspired by others in our community.</li>
  <li>Track your favorite dishes and save them for later.</li>
</ul>

<p>We believe that food is more than just nourishment—it's an experience, a culture, and a way to connect with others. Whether you're here to try new recipes, explore trending restaurants, or simply satisfy your cravings, Foodie Hub is your go-to destination for everything food-related.</p>

<p>To get started, visit your dashboard and personalize your food preferences so we can recommend the best meals and recipes tailored just for you.</p>

<p>We're excited to have you on this culinary journey and can't wait to see what you discover and create!</p>

<p>धन्यवाद<br />
<strong>The Foodie Hub Team</strong></p>
`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successful!";
  const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} was successful.\n\nBest regards,\nThe Banking Syestem Team`;
  const html = `<p>Hello ${name},</p><p>Your transaction of $${amount} to account ${toAccount} was successful.</p><p>Best regards,<br>The Banking Syestem Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Failed";
  const text = `Hello ${name},\n\nWe regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.\n\nBest regards,\nThe Banking Syestem Team`;
  const html = `<p>Hello ${name},</p><p>We regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.</p><p>Best regards,<br>The Banking Syestem Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};
