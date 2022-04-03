/// <reference path="../typings/file-fixture.d.ts" />
import fixture from 'file-fixture';
import test from 'ava';
import path from 'path';
import readConfig from './readConfig';

test('read config from package.json', async (t) => {
  const libDir = 'test';

  const tmpDir = fixture.dir({
    'package.json': JSON.stringify({
      name: 'test',
      nlink: {
        lib: libDir
      }
    }),
    [libDir]: 'dummy file',
  });

  const config = await readConfig({
    cwd: tmpDir
  });

  t.is(config.lib, path.resolve(tmpDir, libDir));
});

test('read config from tsconfig', async (t) => {
  const libDir = 'test';

  const tmpDir = fixture.dir({
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        outDir: libDir,
      }
    }),
    'package.json': JSON.stringify({
      name: 'test',
    }),
    [libDir]: 'dummy file',
  });

  const config = await readConfig({
    cwd: tmpDir
  });

  t.is(config.lib, path.resolve(tmpDir, libDir));
});
