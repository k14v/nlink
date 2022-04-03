/// <reference path="../typings/npm-root.d.ts" />
import findUp from 'find-up';
import path from 'path';
import util from 'util';
import fs from 'fs';
import { homedir } from 'os';
import { symlinkRelative, symlinkRealpathSync, symlinkExistsSync, cleanUndef } from './utils';
import readConfig, { ReadConfigOptions, ReadConfigData } from './readConfig';
import defaultLogger from './logger';
import npmRoot, { NpmRootOptions } from 'npm-root';

const npmrp = util.promisify<NpmRootOptions, string>(npmRoot);

export type EnsureLinksOptions =
& ReadConfigOptions
& Partial<ReadConfigData>
& {
  workspace: boolean;
}

export const ensureLinks = async (opts?: EnsureLinksOptions) => {
  const {
    cwd: cwdDir = process.cwd(),
    logger = defaultLogger,
    workspace = true,
    ...restOptions
  } = { ...opts };

  const linkModule = (target: string, linkpath: string) => {
    const realpathLinkedModuleDir = symlinkRealpathSync(linkpath);
    if (target === realpathLinkedModuleDir) {
        logger.silly(`Already linked to ${target}`);
        return false;
    } else {
        logger.silly(`Removing ${linkpath}`);
        logger.silly(`Linking ${linkpath} -> ${target}`);
        return symlinkRelative(target, linkpath, true);
    }
  }

  const config = {...(await readConfig(opts)), ...cleanUndef(restOptions)};

  const pkgLinkPath = path.join(config.lib, 'package.json');
  logger.silly(`Linking package.json to "${pkgLinkPath}"`);
  if (symlinkRelative(config.pkgPath, pkgLinkPath, true)) {
    logger(`Package.json linked "${config.pkgPath}" to "${pkgLinkPath}"`);
  } else {
    throw new Error('Failed to link package.json')
  };


  const linkSuites = [{
    name: 'yarn',
    dir: path.resolve(homedir(), '.config/yarn/link'),
  }, {
    name: 'npm',
    dir: await npmrp({ global: true }),
  }]

  linkSuites.forEach(({ dir, name }) => {
    logger.silly(`Checking if "${name}" config exist in "${dir}"`);

    if (fs.existsSync(dir)) {
        logger.info(`Detected "${name}" config in "${dir}"`);

        const linkedModuleDir = path.resolve(dir, config.name);

        logger.silly(`Checking if the module exists as "${name}" link in "${linkedModuleDir}"`);
        if (symlinkExistsSync(linkedModuleDir)) {
            logger.info(`Detected linked module "${linkedModuleDir}"`);

            logger.silly(`Replacing module link "${linkedModuleDir}" to "${config.lib}"`);
            if(linkModule(config.lib, linkedModuleDir)) {
              logger(`Module linked "${linkedModuleDir}" to "${config.lib}"`);
            };
        }
    }
  });

  if (workspace) {
    const workspacePkgPath = findUp.sync('package.json', {
      cwd: path.resolve(cwdDir, '..'),
    });

    if (workspacePkgPath) {
        const linkedModuleDir = path.resolve(path.dirname(workspacePkgPath), 'node_modules', config.name);

        logger.silly(`Checking if the module exist as link in workspace "${linkedModuleDir}"`);
        if (symlinkExistsSync(linkedModuleDir)) {
            logger.info(`Detected workspace linked path "${linkedModuleDir}"`);
            linkModule(config.lib, linkedModuleDir);
        } else {
            logger.silly(`Skiping "${config.name}" doesn't exist in workspace "${workspacePkgPath}"`);
        }
    }
  } else {
    logger.silly(`Skiping find module in workspace "opts.workspace=${workspace}"`);
  }
}


export default ensureLinks;
