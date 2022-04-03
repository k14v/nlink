import fs from 'fs';
import path from 'path';
import readTsconfig from 'read-tsconfig';
import type { CoreProperties as PackageJSON } from '@schemastore/package';
import defaultLogger from './logger';


export interface ReadConfigOptions {
  cwd?: string;
  logger?: typeof defaultLogger
}

export interface ReadConfigData {
  pkgPath: string,
  name: string,
  lib: string;
}

export const readConfig = async (opts?: ReadConfigOptions): Promise<ReadConfigData> => {

  const{
    cwd = process.cwd(),
    logger = defaultLogger,
  } = { ...opts };

  const pkgPath = path.resolve(cwd, 'package.json');
  const pkgContents = fs.readFileSync(pkgPath);
  const pkgJSON = JSON.parse(pkgContents.toString()) as PackageJSON;

  let libDir = pkgJSON?.nlink?.lib;

  if (libDir) {
    logger.info(`Detected configuration for lib directory from pkg.nlink.lib: "${libDir}"`);
  } else {
    libDir = (await readTsconfig({ cwd }) as any).compilerOptions?.outDir;

    if (libDir) {
      logger.info(`Detected configuration for lib directory from tsconfig: "${libDir}"`);
    }
  }

  if (typeof libDir !== 'string') {
    throw new Error('nlink: Can\'t not guess the transpiled lib directory');
  }

  const resolvedLib = path.resolve(cwd, libDir);

  if (!fs.existsSync(resolvedLib)) {
    throw new Error(`nlink: Missing is not exists "${resolvedLib}"`)
  }

  if (!pkgJSON.name) {
      throw new Error(`nlink: Empty package.json name property`)
  }

  return {
    pkgPath,
    name: pkgJSON.name,
    lib: resolvedLib
  }
}

export default readConfig;
