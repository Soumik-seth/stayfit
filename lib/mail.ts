import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendOtpEmail(
  email: string,
  otp: string
) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "StayFit Password Reset OTP",

    text: `
Your StayFit password reset OTP is: ${otp}

This OTP will expire in 10 minutes.

If you did not request a password reset, please ignore this email.

Regards,
StayFit Team
`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 30px;
        background: #f7f9f8;
      ">

        <div style="
          background: white;
          padding: 30px;
          border-radius: 16px;
          text-align: center;
          border: 1px solid #eeeeee;
        ">

          <h1 style="
            color: #0C4372;
            margin-bottom: 5px;
          ">
            StayFit
          </h1>

          <p style="
            color: #CAA035;
            font-weight: 600;
          ">
            Your healthier tomorrow. Start today.
          </p>

          <h2 style="
            color: #0C4372;
            margin-top: 30px;
          ">
            Password Reset
          </h2>

          <p style="
            color: #555555;
            font-size: 15px;
          ">
            Use the OTP below to reset your StayFit password.
          </p>

          <div style="
            margin: 25px 0;
            padding: 18px;
            background: #f1f5f8;
            border-radius: 12px;
          ">

            <p style="
              margin: 0;
              color: #777777;
              font-size: 13px;
            ">
              Your OTP
            </p>

            <h1 style="
              margin: 8px 0 0;
              color: #0C4372;
              letter-spacing: 8px;
              font-size: 32px;
            ">
              ${otp}
            </h1>

          </div>

          <p style="
            color: #777777;
            font-size: 13px;
          ">
            This OTP will expire in 10 minutes.
          </p>

          <p style="
            color: #777777;
            font-size: 13px;
            margin-top: 25px;
          ">
            If you did not request a password reset,
            please ignore this email.
          </p>

          <hr style="
            border: none;
            border-top: 1px solid #eeeeee;
            margin: 25px 0;
          ">

          <p style="
            color: #999999;
            font-size: 12px;
          ">
            © StayFit. All rights reserved.
          </p>

        </div>

      </div>
    `,
  });
}