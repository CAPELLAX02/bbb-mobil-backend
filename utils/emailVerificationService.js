import nodemailer from 'nodemailer';

const sendVerificationEmail = async (userEmail, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL_USER,
      pass: process.env.SMTP_EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"BBB Mobil" <yourapp@example.com>',
    to: userEmail,
    subject: 'E-posta Adresinizi Doğrulayın.',
    html: `
    <h3>BBB Mobil uygulamasında devam etmek için e-posta adresinizi doğrulayın.</h3>
    <h4>E-posta adresinizi doğrulamak için onay kodunuz:</h4>
    <h2>${verificationCode}</h2>
    <p><i>Bu bağlantı 10 dakika içerisinde geçersiz olacaktır.</i></p>
  `,
  });

  console.log(`Doğrulama e-postası ${userEmail} adresine gönderildi.`);
};

export default sendVerificationEmail;
