import nodemailer from 'nodemailer';

const sendPasswordResetEmail = async (userEmail, resetCode) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL_USER,
      pass: process.env.SMTP_EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"BBB Mobil" <ahmetatar002@gmail.com>',
    to: userEmail,
    subject: 'BBB Mobil için Şifrenizi Sıfırlayın.',
    html: `
      <h3>Şifrenizi Sıfırlayın</h3>
      için e-posta adresinizi doğrulayın.</h3>
      <h4>Şifrenizi sıfırlamanız için gerekli onay kodu:</h4>
      <h2>${resetCode}</h2>
      <p><i>Bu bağlantı 10 dakika içerisinde geçersiz olacaktır.</i></p>
    `,
  });

  console.log(`Şifre sıfırlama kodu ${userEmail} adresine gönderildi.`);
};

export default sendPasswordResetEmail;
