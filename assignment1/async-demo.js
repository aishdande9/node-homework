


const fs = require('fs');
const path = require('path');

const sampleFilesDir = path.join(__dirname, 'sample-files');
const sampleTxt = path.join(sampleFilesDir, 'sample.txt');

if (!fs.existsSync(sampleFilesDir)) {
  fs.mkdirSync(sampleFilesDir, { recursive: true });
}

fs.writeFileSync(sampleTxt, 'Hello, async world!');

// Callback example
fs.readFile(sampleTxt, 'utf8', (err, data) => {
  if (err) {
    console.log('Callback error:', err.message);
    return;
  }

  console.log('Callback read:', data);
});

// Callback hell example:
// fs.readFile('file1.txt', 'utf8', (err, data1) => {
//   fs.readFile('file2.txt', 'utf8', (err, data2) => {
//     fs.readFile('file3.txt', 'utf8', (err, data3) => {
//       console.log(data1, data2, data3);
//     });
//   });
// });

// Promise example
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

readFilePromise(sampleTxt)
  .then((data) => {
    console.log('Promise read:', data);
  })
  .catch((err) => {
    console.log('Promise error:', err.message);
  });

// Async/Await example
async function run() {
  try {
    const data = await readFilePromise(sampleTxt);
    console.log('Async/Await read:', data);
  } catch (err) {
    console.log('Async/Await error:', err.message);
  }
}

run();