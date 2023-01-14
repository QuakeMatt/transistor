import { join } from 'path';
import { readFileSync } from 'fs';
import { tmpdir } from 'os';
import typescript from 'typescript';
import typescriptPlugin from 'rollup-plugin-typescript2';

const pkg = JSON.parse(readFileSync('./package.json'));

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'default',
        },
        {
            file: pkg.module,
            format: 'es',
        },
        {
            file: './dist/transistor.js',
            format: 'iife',
            name: 'transistor',
        },
    ],
    external: [
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {}),
    ],
    plugins: [
        typescriptPlugin({
            typescript: typescript,
            cacheRoot: join(tmpdir(), pkg.name, 'rollup-plugin-typescript2')
        }),
    ],
}
