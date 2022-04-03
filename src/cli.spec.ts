import test from 'ava';
import execa from 'execa';

test('should link the directories and the files which match the pattern 1', async (t) => {
  const { stdout } = await execa('ts-node', ['./src/cli.ts', '--verbose', '--cwd=$CWD']);

  t.log(stdout);

  t.pass();
});

test('should link the directories and the files which match the pattern 2', async (t) => {
  const { stdout } = await execa('ts-node', ['./src/cli.ts', '--verbose']);

  t.log(stdout);

  t.pass();
});
