const glob = require('glob');
const path = require('path');
const rimraf = require('rimraf');
const { getUniqueDirectories, getRootFiles, printLn, handleError } = require('./utils');


function clean({
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

    const rootFiles = getRootFiles(files);
    const directories = getUniqueDirectories(files);

    const rimrafFiles = directories.concat(rootFiles);
    const rimrafPattern = path.join(outputDirectory, `{${rimrafFiles.join(',')}}`);
    return rimraf(rimrafPattern, (err) => {
      if (err) return handleError(err);
      printLn(`${rimrafFiles.length} Files cleaned!`);
      return 0;
    });
  })
}

module.exports = clean;
