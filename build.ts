import { build } from 'esbuild';
import { rm } from 'fs/promises';
import { generateDtsBundle } from 'dts-bundle-generator';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

const { dependencies, devDependencies, peerDependencies } = require('./package.json');

rm('./lib', { recursive: true });

const buildOptions = {
  bundle: true,
  external: [
    ...Object.keys(dependencies ?? []),
    ...Object.keys(devDependencies ?? []),
    ...Object.keys(peerDependencies ?? [])
  ],
  minify: true,
  sourcemap: false,
};
(async () => {

  const server = build({
    ...buildOptions,
    entryPoints: ['./src/server/index.ts'],
    format: 'cjs',
    outdir: './lib/server',
  });

  const client = build({
    ...buildOptions,
    entryPoints: ['./src/client/index.ts'],
    format: 'cjs',
    outdir: './lib/client',
  });

  await Promise.all([ server, client ]);

  const serverDts = generateDtsBundle([
    {
      filePath: './src/server/index.ts',
      output: {
        exportReferencedTypes: false
      }
    },
  ]);
  const clientDts = generateDtsBundle([
    {
      filePath: './src/client/index.ts',
      output: {
        exportReferencedTypes: false
      }
    },
  ]);

  await writeFile(resolve('./lib/server/index.d.ts'), serverDts);
  await writeFile(resolve('./lib/client/index.d.ts'), clientDts);

})();
