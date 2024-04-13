import jwt from 'jsonwebtoken';

export const generateAdminToken = (userId) => {
  const adminToken = jwt.sign(
    { id: userId, isAdmin: true },
    process.env.JWT_ADMIN_SECRET,
    {
      expiresIn: '24h', // güvenlik önlemi olarak 24 saatte bir oturum bilgisi yenilenir. admin kullanıcı 24 saatte bir sistemde oturum açmalıdır.
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Sadece HTTPS üzerinden cookie gönder (.env/NODE_ENV=production)
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Cookie'nin geçerlilik süresi 1 gün (Admin paneli gibi daha hassas uygulamalarda, genellikle token'ın geçerlilik süresi ile cookie'nin saklama süresini aynı tutmak daha mantıklıdır. Bu, güvenliği artırır ve kullanıcıların token süresi dolduğunda otomatik olarak sistemden çıkış yapmalarını sağlar, böylece güvenlik risklerini azaltır. )
    sameSite: 'strict', // CSRF saldırılarına karşı koruma
  };

  return { adminToken, cookieOptions };
};
