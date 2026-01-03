import nodemailer from "nodemailer";

export const sendCredentialsMail = async (email, adminId, password) => {
  try {
    console.log("Sending to:", email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SYSTEM_EMAIL,
        pass: process.env.SYSTEM_EMAIL_PASS, // App Password ONLY
      },
    });

    await transporter.verify();
    console.log("Mail server ready");

    await transporter.sendMail({
      from: `"Smart Uttarakhand Admin" <${process.env.SYSTEM_EMAIL}>`,
      to: email,
      subject: "Your Admin Credentials",
      html: `
        <h3>Your Admin Account</h3>
        <p><b>Admin ID:</b> ${adminId}</p>
        <p><b>Password:</b> ${password}</p>
        <br/>
        <p>Use these credentials to log in.</p>
      `,
    });

    console.log("Email sent!");
  } catch (err) {
    console.error("Email error:", err.message);
  }
};
