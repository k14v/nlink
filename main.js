const glob = require('glob');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const { getUniqueDirectories, handleError, printLn } = require('./utils');


function main({
  scanPattern,
  ignorePatter,
  directoryToScan,
  outputDirectory,
} = {}){
  glob(scanPattern, {
    // Restrict scan directory
    cwd: directoryToScan,
    // Retrieve relative paths
    absolute: false,
    // Ignore files by pattern
    ignore: ignorePatter,
  }, (err, files) => {
    if(err) return handleError(err);

    const directories = getUniqueDirectories(files);

    // Create all the directories before creating all the files
    // so they have a target directory
    Promise.all(directories.map((directory) => mkdirp(directory)))
    .then(() => {
      printLn(`${directories.length} Directories linked!`);
    }).then(() => {
      files.forEach((file) => {
        //To ensure it works in Windows
        const relativePath = file.replace(/\\/gi, '/');
        fs.writeFile(path.join(outputDirectory, file), `module.exports = require('./${relativePath}');\n`, handleError)
      });
    }).then(() => {
      printLn(`${files.length} Files linked!`);
    })
  });
}

module.exports = main;
