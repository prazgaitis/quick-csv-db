# CSV-DB

Need a quick place to store some data? Toss a few CSV files into a directory and start writing queries!

## Usage

Make a directory in your project called `data` or whatever you like. Put any number of CSV files into this new directory. These CSVs are your database tables. They should be formatted like this:

```csv
id,name,created
1,Alice,1659322703323
2,Not Bob,1659322728371
3,Charlie,1659412565157
7,Eleven,1659412565157
```

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