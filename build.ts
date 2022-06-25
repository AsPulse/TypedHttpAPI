import { build } from 'esbuild';
import { rm, writeFile } from 'fs/promises';
import { generateDtsBundle } from 'dts-bundle-generator';
import { resolve } from 'path';

const { dependencies, devDependencies, peerDependencies } = require('./package.json');


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

  await rm('./lib', { recursive: true, force: true });
  await rm('./server', { recursive: true, force: true });
  await rm('./client', { recursive: true, force: true });

  await build({
    ...buildOptions,
    entryPoints: ['./src/entry/server.ts'],
    format: 'cjs',
    outfile: './server/index.js',
  });

  await build({
    ...buildOptions,
    entryPoints: ['./src/entry/client.ts'],
    format: 'cjs',
    outfile: './client/index.js',
  });


  const serverDts = generateDtsBundle([
    {
      filePath: './src/entry/server.ts',
      output: {
        exportReferencedTypes: false
      }
    },
  ]);

  const clientDts = generateDtsBundle([
    {
      filePath: './src/entry/client.ts',
      output: {
        exportReferencedTypes: false
      }
    },
  ]);

  await writeFile(resolve('./server/index.d.ts'), serverDts);
  await writeFile(resolve('./client/index.d.ts'), clientDts);

})();
