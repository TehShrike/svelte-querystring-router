import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import svelte from 'rollup-plugin-svelte'

export default {
	name: `svelteQuerystringRouter`,
	input: `./create-instance.js`,
	output: {
		file: `./create-instance-bundle.js`,
		format: `cjs`,
	},
	sourcemap: true,
	plugins: [
		svelte(),
		commonjs(),
		resolve({
			browser: true,
		}),
		babel({
			exclude: `node_modules/**`,
			babelrc: false,
			presets: [
				[
					`es2015`,
					{
						modules: false,
					},
				],
			],
			plugins: [
				`external-helpers`,
			],
		}),
	],
}
