declare module 'npm-root' {


  export type NpmRootCallback = (err: Error | null, localPath: string) => void;
  export type NpmRootOptions = { cwd?: string, global?: boolean };

  function npmRoot(cb: NpmRootCallback): void
  function npmRoot(opts: NpmRootOptions, cb: NpmRootCallback): void

  export default npmRoot;
}
