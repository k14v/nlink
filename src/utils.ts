import path from 'path';
import fs from 'fs';

export const symlinkExistsSync = (path: fs.PathLike) => {
    try {
        const stats = fs.lstatSync(path);
        return stats.isSymbolicLink();

    } catch (ex) {
        return false;
    }
}

export const symlinkRealpathSync = (path: fs.PathLike) => {
    try {
        return fs.realpathSync(path);
    } catch (ex) {
        return false;
    }
}


export const symlinkRelative = (target: string, linkpath: string, force = false, type?: fs.symlink.Type | null) => {

  if (force && symlinkExistsSync(linkpath)) {
    fs.unlinkSync(linkpath);
  }

  try {
    const targetRelative = path.relative(path.join(linkpath, '..'), target);
    fs.symlinkSync(targetRelative, linkpath, type);
    return true;
  } catch (ex) {
    if (force)
      console.warn(ex);
    return false;
  }
}

export const cleanUndef = <T extends Record<string, any>>(obj: T) => {
  Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined) {
          delete obj[key];
      }
  });
  return obj;
};
