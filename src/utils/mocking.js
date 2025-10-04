import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const PASSWORD_PLAIN = 'coder123';

// helpers
const hashPassword = (plain) => bcrypt.hashSync(plain, bcrypt.genSaltSync(10));
const randomRole = () => (Math.random() < 0.5 ? 'user' : 'admin');

// USERS
export const generateUser = () => {
  const first_name = faker.person.firstName();
  const last_name = faker.person.lastName();
  const email = faker.internet.email({ firstName: first_name, lastName: last_name }).toLowerCase();

  return {
    // _id para simular documento Mongo en el endpoint /mockingusers
    _id: faker.database.mongodbObjectId(),
    first_name,
    last_name,
    email,
    password: hashPassword(PASSWORD_PLAIN), // "coder123" encriptada
    role: randomRole(),
    pets: [], // array vacío según consigna
  };
};

export const generateUsers = (n = 50) => Array.from({ length: n }, generateUser);

// PETS
export const generatePet = () => {
  return {
    name: faker.animal.petName(),
    specie: faker.helpers.arrayElement(['dog', 'cat', 'bird', 'hamster', 'fish']),
    birthDate: faker.date.birthdate().toISOString(),
    adopted: false,
  };
};

export const generatePets = (n = 20) => Array.from({ length: n }, generatePet);