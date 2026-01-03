import nodemailer from "nodemailer";

export const sendCredentialsMail = async (email, adminId, password) => {
  try {
    console.log("📨 Sending email to:", email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SYSTEM_EMAIL,
        pass: process.env.SYSTEM_EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("✔ Mail server ready");

    await transporter.sendMail({
      from: `"Smart Uttarakhand Admin" <${process.env.SYSTEM_EMAIL}>`,
      to: email,
      subject: "Your Admin Login Credentials",
      html: `
        <h2>Smart Uttarakhand Admin Access</h2>
        <p>Your admin login details are below:</p>
        <b>Admin ID:</b> ${adminId}<br/>
        <b>Password:</b> ${password}<br/><br/>
        <p>You can now log in using these credentials.</p>
      `,
    });

    console.log("✔ Email sent successfully");

  } catch (err) {
    console.error("❌ Email Send Error:", err.message);
    throw new Error("Email sending failed");
  }
};
