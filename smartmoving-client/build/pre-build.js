const path = require('path');
const fs = require('fs');
const util = require('util');

const cacheBurster = new Date().getTime();

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const filePath = 'src/main.ts';

readFile(filePath, 'utf8').then(contents => {
  contents = contents + `\nconst version = '${cacheBurster}';`
  return writeFile(filePath, contents);
}).then(contents => {
  console.log('Wrote new cache bursting value.');
})
