/// <reference path="../typings/file-fixture.d.ts" />
import test from 'ava';
import Fixture from 'file-fixture';
import fs from 'fs';
import path from 'path';
import { symlinkExistsSync, symlinkRealpathSync, symlinkRelative } from './utils';

test('symlinkExistsSync', (t) => {
  const fixture = new Fixture();

  const tmpDir = fixture.dir({
    dummy: 'dummy'
  });

  const filePath = path.join(tmpDir, 'dummy');
  const linkPath = path.join(tmpDir, 'linkfile');

  t.false(symlinkExistsSync(linkPath));
  t.false(symlinkExistsSync(filePath));

  fs.symlinkSync(filePath, linkPath);

  t.true(symlinkExistsSync(linkPath));

  fixture.clean();
});

test('symlinkRealpathSync', (t) => {

  const fixture = new Fixture();

  const tmpDir = fixture.dir({
    dummy: 'dummy'
  });

  const filePath = path.join(tmpDir, 'dummy');
  const linkPath = path.join(tmpDir, 'linkfile');

  fs.symlinkSync(filePath, linkPath);

  const existingRealPathLink = symlinkRealpathSync(linkPath);

  t.true(typeof existingRealPathLink === 'string');

  // In MacOS the real path is prefixed with /private due is a liked
  // to tmp folder but the mainfull path is the dummy file
  t.true((existingRealPathLink as string).endsWith(filePath));

  t.false(symlinkRealpathSync('non_existing_path'));

  fixture.clean();
});

test('symlinkRelative', (t) => {
  const fixture = new Fixture();

  const tmpDir = fixture.dir({
    dummy: 'dummy'
  });

  const filePath = path.join(tmpDir, 'dummy');
  const linkPath = path.join(tmpDir, 'linkfile');

  t.true(symlinkRelative(filePath, linkPath));

  t.is(fs.readlinkSync(linkPath), 'dummy');
  t.true(fs.realpathSync(linkPath).endsWith(filePath));

  fixture.clean();
});
