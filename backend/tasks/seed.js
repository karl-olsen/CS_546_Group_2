const connection = require('../config/mongoConnection');
const data = require('../data');
const users = data.users;

async function main() {
  const db = await connection.connectToDb();
  await db.dropDatabase();

  const x = await users.create('mike');

  console.log('Seeded');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    connection.closeConnection();
  });
