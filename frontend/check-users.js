const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 51214,
  database: "postgres",
  user: "postgres",
});

async function main() {
  await client.connect();

  const result = await client.query(
    'SELECT id, email, name FROM "User"'
  );

  console.table(result.rows);

  await client.end();
}

main().catch(async (error) => {
  console.error(error);
  await client.end();
});