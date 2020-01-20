import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'

export default {
	input: `./create-instance.js`,
	output: {
		file: `./create-instance-bundle.js`,
		format: `esm`,
		sourcemap: true,
	},
	plugins: [
		svelte({
			dev: true
		}),
		commonjs(),
		resolve({
			browser: true,
		}),
	],
}
