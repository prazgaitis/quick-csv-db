# CSV-DB

Need a quick place to store some data? Toss a few CSV files into a directory and start writing queries!

## Usage

```javascript
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
```

## TODO:
Make this an NPM package