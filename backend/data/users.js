const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const error = require('../error');
const bcrypt = require('bcrypt');

async function doesEmailExist(email) {
  const usersCollection = await users();
  const user = await usersCollection.findOne({ email: email });
  if (!user) return false;
  return true;
}

async function hashPassword(plaintext) {
  const saltRounds = 16;
  return await bcrypt.hash(plaintext, saltRounds);
}

async function createUser(firstName, lastName, email, password, role) {
  error.str(firstName);
  error.str(lastName);
  error.str(email);
  error.validPassword(password);
  error.validRole(role);

  const parsedEmail = email.toLowerCase().trim();
  const parsedRole = role.toLowerCase().trim();

  if (await doesEmailExist(parsedEmail)) throw new Error('Email already exists.');

  const hashedPassword = await hashPassword(password);
  const usersCollection = await users();

  const newUser = {
    firstName: firstName,
    lastName: lastName,
    email: parsedEmail,
    password: hashedPassword,
    role: parsedRole,
    classes: [],
  };

  const insert = await usersCollection.insertOne(newUser);
  if (insert.insertedCount === 0) throw new Error('Could not add new user.');

  const newId = insert.insertedId;

  return newId;
}

async function checkUser(email, password) {
  if (arguments.length !== 2) throw new Error('This function takes 2 arguments.');
  error.str(email);
  error.validPassword(password);
  const parsedEmail = email.toLowerCase().trim();
  const usersCollection = await users();
  const user = await usersCollection.findOne({ email: parsedEmail });
  if (!user) throw new Error(`Either the username or password is invalid`);
  const compareToMatch = await bcrypt.compare(password, user?.password);
  if (!compareToMatch) throw new Error('Either the username or password is invalid');

  return { authenticated: true };
}

module.exports = {
  createUser,
  checkUser,
};
