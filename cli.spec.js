const test = require('ava');
const fs = require('fs');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const { exec } = require("child_process");


test.before(t => {
  /* Lets create this structure of folders and files
    /test  
      /first
        /fourth
          F.js
          F.spec.js
        A.js
        B.js
        C.js
        C.spec.js
      /second
        D.js
        E.js
      /third
        TEST.spec.js
  */
  const folders = [
    './test/first/fourth',
    './test/second',
    './test/third',
  ];
  const files = [
    './test/first/A.js',
    './test/first/B.js',
    './test/first/C.js',
    './test/first/C.spec.js',
    './test/first/fourth/F.js',
    './test/first/fourth/F.spec.js',
    './test/second/D.js',
    './test/second/E.js',
    './test/third/TEST.spec.js',
  ];
  return Promise.all(
    folders.map((folder) => mkdirp(folder).catch((err) => t.log(err)))
  ).then(() => {
    files.forEach((file) => fs.writeFile(file, '', () => {}));
  });
});

test.after.always('Guaranteed cleanup', () => {
  return new Promise((resolve, reject) => {
    rimraf('{test,first,second}', (err) => err ? reject(error) : resolve());
  });
});

test.serial('should link the directories and the files which match the pattern', (t) => {
  return new Promise((resolve, reject) => {
    exec('./cli test', (err, _, stderr) => {
      if(err){
        reject(t.fail());
      } else {
        t.true(stderr.includes('3 Directories'));
        t.true(stderr.includes('6 Files'));
        resolve();
      }
    })
  })
});

test.serial('should clean all the linked folders and files when the flag --clean it\'s used', (t) => {
  return new Promise((resolve, reject) => {
    exec('./cli test --clean', (err, _, stderr) => {
      if(err){
        reject(t.fail());
      } else {
        t.true(stderr.includes('3 Files cleaned'));
        resolve();
      }
    })
  })
});