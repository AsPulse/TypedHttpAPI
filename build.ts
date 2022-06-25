import { build } from 'esbuild';
import { dtsPlugin } from 'esbuild-plugin-d.ts';
import { rm } from 'fs/promises';
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

build({
  ...buildOptions,
  entryPoints: ['./src/index.ts'],
  format: 'cjs',
  outdir: './lib/server',
  plugins: [dtsPlugin()]
});

build({
  ...buildOptions,
  entryPoints: ['./src/client.ts'],
  format: 'cjs',
  outdir: './lib/client',
  plugins: [dtsPlugin()]
});
