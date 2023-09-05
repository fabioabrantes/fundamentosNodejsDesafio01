import fs from 'node:fs';
import { parse } from 'csv-parse';

const csvPath = new URL('./db.csv', import.meta.url);
console.log(csvPath);

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  skipEmptyLines: true,//skips any line which is empt
  fromLine: 2, // skip the header line
  trim:true,
});

async function readingCsv() {
  const linesParse = stream.pipe(csvParse);

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    });

  }

}

readingCsv();

