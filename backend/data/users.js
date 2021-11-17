const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

async function create(name) {
  const usersCollection = await users();

  const insert = await usersCollection.insertOne({ name });
  if (insert.insertedCount === 0) throw new Error('Could not add.');

  const newId = insert.insertedId;

  return newId;
}

module.exports = {
  create,
};
