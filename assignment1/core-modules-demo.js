const os = require('os');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const sampleFilesDir = path.join(__dirname, 'sample-files');

if (!fs.existsSync(sampleFilesDir)) {
  fs.mkdirSync(sampleFilesDir, { recursive: true });
}

async function run() {
  try {
    // OS module
    console.log('Platform:', os.platform());
    console.log('CPU:', os.cpus()[0].model);
    console.log('Total Memory:', os.totalmem());

    // Path module
    const joinedPath = path.join(sampleFilesDir, 'folder', 'file.txt');
    console.log('Joined path:', joinedPath);

    // fs.promises module
    const demoFile = path.join(sampleFilesDir, 'demo.txt');

    await fsPromises.writeFile(demoFile, 'Hello from fs.promises!');

    const content = await fsPromises.readFile(demoFile, 'utf8');

    console.log('fs.promises read:', content);
  } catch (err) {
    console.log('Error:', err.message);
  }
}

run();