const fs = require('fs');
const path = require('path');

const lineToObject = (line, header) => {
  const obj = {};

  for (let i = 0; i < header.length; i++) {
    obj[header[i]] = line[i];
  }

  return obj;
}

const objectToLine = (obj, header, separator = ',') => {
  return header.map(key => obj[key]).join(separator)
}

function Client(name, path, separator = ',') {
  function data() {
    const text = fs.readFileSync(path, 'utf-8');
    const header = text.split('\n')[0].split(separator);
    const records = text.split('\n')
      .slice(1)
      .map(line => line.split(separator))
      .map(line => lineToObject(line, header));

    return { records, header };
  }

  function find(predicate) {
    const { records } = data();
    const filter = (record) => {
      return Object.keys(predicate).every(key => {
        return record[key] === predicate[key];
      });
    }

    return records.filter(filter);

    return filtered.length === 1 ? filtered[0] : filtered;
  }

  const writeFile = (records, header) => {
    const lines = records.map(r => objectToLine(r, header))

    const text = [header, ...lines].join('\n');

    fs.writeFileSync(
      path,
      text,
      'utf-8'
    )
  }

  return {
    _model: name,
    find,
    create: (obj) => {
      const { records, header } = data();
      const nextId = records.length > 0 ?
        parseInt(records[records.length - 1].id) + 1 :
        1;

      const newRecord = { id: nextId, ...obj };
      records.push(newRecord)
      writeFile(records, header)

      return newRecord;
    },
    update: (predicate, updates) => {
      const { records, header } = data();

      const updatedRecords = [];

      const updated = records.map((record) => {
        const match = Object.keys(predicate).every(key => (predicate[key] === record[key]));
        if (match) {
          updatedRecords.push(record);
          return { ...record, ...updates }
        } else {
          return record;
        }
      })

      console.log({ updates, updated })
      writeFile(updated, header);
      return updatedRecords;
    },
    destroy: (predicate) => {
      const { records, header } = data();
      const ids_to_delete = find(predicate)
        .map(record => record.id);

      writeFile(records.filter(rec => !ids_to_delete.includes(rec.id)), header);
      return true;
    },
    findAll: () => {
      const { records } = data();
      return records;
    }
  }
}

function db() {
  // read all files in input dir
  const data_directory = arguments[0] || 'data';

  // get all the files in the target directory
  const files = fs.readdirSync(data_directory, 'utf-8').map(fname => (
    {
      path: path.join(__dirname, data_directory, fname),
      model: fname.split('.csv')[0]
    }
  ));

  const obj = {};

  files.forEach(({ path, model }) => {
    obj[model] = new Client(model, path)
  });

  return obj;
}

module.exports = db;