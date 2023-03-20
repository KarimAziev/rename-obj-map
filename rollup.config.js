const nodeResolve = require('@rollup/plugin-node-resolve');
const { defineConfig } = require('rollup');
const typescript = require('rollup-plugin-typescript2');
const pkg = require('./package.json');

const noDeclarationFiles = { compilerOptions: { declaration: false } };
const extensions = ['.ts'];

module.exports = defineConfig([
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      indent: false,
      format: 'cjs',
    },
    plugins: [
      nodeResolve({
        extensions,
      }),
      typescript({ useTsconfigDeclarationDir: true }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.module,
      indent: false,
      format: 'es',
    },
    plugins: [
      nodeResolve({
        extensions,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.unpkg,
      format: 'umd',
      name: 'RenameObjMap',
      indent: false,
    },
    plugins: [
      nodeResolve({
        extensions,
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
    ],
  },
]);
