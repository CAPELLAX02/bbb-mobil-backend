import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin',
    surname: 'ADMİN',
    phone: '0505 05 55 55',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Ahmet',
    surname: 'ATAR',
    phone: '0531 881 18 76',
    email: 'ahmet@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
  {
    name: 'Seyit',
    surname: 'TUTAR',
    phone: '0537 786 30 63',
    email: 'ahmet@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
];

export default users;
