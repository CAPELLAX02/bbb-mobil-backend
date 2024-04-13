import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  const regularUserToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  return { regularUserToken };
};

export default generateToken;
