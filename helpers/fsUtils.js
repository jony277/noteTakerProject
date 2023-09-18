const fs = require('fs');

// Function to read from a file
const readFromFile = (filePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });

// Function to append data to a file
const readAndAppend = (content, filePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (readErr, data) => {
      if (readErr) {
        reject(readErr);
        return;
      }

      const parsedData = JSON.parse(data);

      parsedData.push(content);

      fs.writeFile(filePath, JSON.stringify(parsedData, null, 4), (writeErr) => {
        if (writeErr) {
          reject(writeErr);
          return;
        }

        resolve('Content added to file');
      });
    });
  });

module.exports = { readFromFile, readAndAppend };
