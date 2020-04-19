const path = require('path');


/**
 * Go throught the files and filter it
 * of '.' directories and duplicated directories
 * @name getUniqueDirectories
 * @param {string[]} files
 * @returns {string[]}
 */
exports.getUniqueDirectories = function(files){
  return files
    .map(path.dirname.bind(null))
    .filter((directory, index, array) => array.indexOf(directory) === index && directory !== '.')
}

/**
 * Get an array of files and return only the root files
 * @name getRootFiles
 * @param {string[]} files
 * @return {string[]}
 */
exports.getRootFiles = function(files){
  return files.filter(file => path.dirname(file) === '.');
}

/**
 * Prints a message in strerr with a line break
 * @name printLn
 * @param {string} message
 * @returns {void}
 */
exports.printLn = function(message){
  process.stderr.write(message + '\n')
}

/**
 * Print a error and return process exit error if the error exists
 * @name handleError
 * @param {Error} err
 * @returns {void|1}
 */
exports.handleError = function(err){
  if(err){
    console.error(err);
    return process.exit(1);
  }
}
