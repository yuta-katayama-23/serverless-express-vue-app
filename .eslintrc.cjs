/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
	root: true,
	extends: [
		'plugin:vue/vue3-essential',
		'plugin:vuetify/recommended',
		'eslint:recommended',
		'airbnb-base',
		'@vue/eslint-config-prettier'
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	settings: {
		'import/resolver': {
			'eslint-import-resolver-custom-alias': {
				alias: {
					'@': './src'
				},
				extensions: ['.js', '.vue']
			}
		}
	},
	overrides: [
		{ files: ['__tests__/**/*.js'], extends: ['plugin:vitest/recommended'] },
		{ files: ['cypress/**/*.js'], extends: ['plugin:cypress/recommended'] }
	],
	rules: {
		'import/no-extraneous-dependencies': ['warn', { packageDir: './' }],
		'import/extensions': 'off',
		'import/no-unresolved': 'warn'
	}
};
