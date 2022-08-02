const db = require('./db')('data');

async function main() {
  const { customers, carts } = db;

  let allCustomers = customers.findAll()
  const customersNamedBob = customers.find({ name: 'Bob' })
  db.customers.update({ name: "Bob" }, { name: "Not Bob" })

  allCustomers = customers.findAll()
  console.log({ allCustomers, customersNamedBob });
}

main();

