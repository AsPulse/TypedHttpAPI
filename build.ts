import { build } from 'esbuild';
import { dtsPlugin } from 'esbuild-plugin-d.ts';
import { rm } from 'fs/promises';
const { dependencies, devDependencies, peerDependencies } = require('./package.json');

rm('./lib', { recursive: true });

const buildOptions = {
  bundle: true,
  entryPoints: ['./src/index.ts', './src/client.ts'],
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
  format: 'cjs',
  outdir: './lib',
  plugins: [dtsPlugin()]
});
