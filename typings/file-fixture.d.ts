declare module 'file-fixture' {

  interface FixtureFileOptions {
    path?: string;
    ext?: string;
  }

  type FixtureFileContent = string | string[];

  class Fixture {
    public root: string;

    /**
     * Creates a temporary file
     */
    public filename(opts?: FixtureFileOptions): string;

    /**
     * Creates a temporary file with defined content
     */
    public file(data: FixtureFileContent, opts?: FixtureFileOptions): string;

    /**
     * Creates a temporary directory
     */
    public dirname(opts?: FixtureFileOptions): string;

    /**
     * Define a temporary directory with files
     */
    public dir(spec: Record<string, FixtureFileContent>, opts?: FixtureFileOptions): string;

    /**
     * Removes the tmp files
     */
    public clean()

    static filename(opts?: FixtureFileOptions): string;
    static dirname(opts?: FixtureFileOptions): string;
    static file(data: FixtureFileContent, opts?: FixtureFileOptions): string
    static dir(files: Record<string, string | string[]>): string;
  }

  export = Fixture;
}
