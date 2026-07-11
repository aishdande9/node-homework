const fs = require('fs');
const path = require('path');

const sampleFilesDir = path.join(__dirname, 'sample-files');
const sampleTxt = path.join(sampleFilesDir, 'sample.txt');

if (!fs.existsSync(sampleFilesDir)) {
  fs.mkdirSync(sampleFilesDir, { recursive: true });
}

fs.writeFileSync(sampleTxt, 'Hello, async world!');

// Converts fs.readFile into a Promise.
function readFilePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// Callback example
fs.readFile(sampleTxt, 'utf8', (err, callbackData) => {
  if (err) {
    console.log('Callback error:', err.message);
    return;
  }

  console.log('Callback: Hello, async world!');
  console.log('Callback read:', callbackData);

  // Promise example starts after the callback completes.
  readFilePromise(sampleTxt)
    .then((promiseData) => {
      console.log('Promise: Hello, async world!');
      console.log('Promise read:', promiseData);

      // Async/Await example starts after the Promise example completes.
      return runAsyncAwaitExample();
    })
    .catch((promiseError) => {
      console.log('Promise error:', promiseError.message);
    });
});

// Async/Await example
async function runAsyncAwaitExample() {
  try {
    const asyncData = await readFilePromise(sampleTxt);

    console.log('Async/Await: Hello, async world!');
    console.log('Async/Await read:', asyncData);
  } catch (asyncError) {
    console.log('Async/Await error:', asyncError.message);
  }
}

/*
Callback hell happens when several asynchronous operations are nested
inside one another. Deep nesting makes code harder to read, debug,
maintain, and handle errors correctly.

Example of callback hell:

fs.readFile('file1.txt', 'utf8', (err, data1) => {
  if (err) return console.log(err.message);

  fs.readFile('file2.txt', 'utf8', (err, data2) => {
    if (err) return console.log(err.message);

    fs.readFile('file3.txt', 'utf8', (err, data3) => {
      if (err) return console.log(err.message);

      console.log(data1, data2, data3);
    });
  });
});

Promises and async/await help avoid this deeply nested structure.
*/