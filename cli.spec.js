const test = require('tape');
const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);
const glob = util.promisify(require('glob'));

const cmd = './cli'
const cwd = 'fixtures';
let fixtures = [];

test(async (t) => {
  fixtures = await glob('**/*.js', { cwd });
  t.pass();
});

test('should link the directories and the files which match the pattern', async (t) => {
  const { stderr } = await exec([cmd, cwd].join(' '));
  const lines = stderr.split('\n');
  t.deepEqual(lines, [
    '3 Directories linked!',
    '8 Files linked!',
    ''
  ]);
});


test('should check if files are created', async (t) => {
  const files = await glob('**/*.js', { cwd: process.cwd() });
  const genFiles = files.filter((value, index, self) => fixtures.indexOf(value) !== -1);

  t.is(genFiles.length, 8);
});

test('should clean all the linked folders and files when the flag --clean it\'s used', async (t) => {
  const { stderr } = await exec([cmd, cwd, '--clean'].join(' '));
  t.is(stderr, '5 Files cleaned!\n');
});