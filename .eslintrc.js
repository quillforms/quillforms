/**
 * External dependencies
 */
const { escapeRegExp, merge } = require( 'lodash' );

/**
 * Internal dependencies
 */

const { version } = require( './package' );

/**
 * Regular expression string matching a SemVer string with equal major/minor to
 * the current package version. Used in identifying deprecations.
 *
 * @type {string}
 */
const majorMinorRegExp =
	escapeRegExp( version.replace( /\.\d+$/, '' ) ) + '(\\.\\d+)?';

module.exports = {
	globals: {
		quillForms: true,
		DOMParser: true,
	},

	root: true,
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended',
		'plugin:prettier/recommended',
		'plugin:jest/recommended',
	],
	rules: {
		'@wordpress/react-no-unsafe-timeout': 'error',
		'no-restricted-syntax': [
			'error',
			// NOTE: We can't include the forward slash in our regex or
			// we'll get a `SyntaxError` (Invalid regular expression: \ at end of pattern)
			// here. That's why we use \\u002F in the regexes below.
			{
				selector:
					'ImportDeclaration[source.value=/^@quillforms\\u002F.+\\u002F/]',
				message:
					'Path access on QuillForms dependencies is not allowed.',
			},
			{
				selector:
					'CallExpression[callee.name="deprecated"] Property[key.name="version"][value.value=/' +
					majorMinorRegExp +
					'/]',
				message:
					'Deprecated functions must be removed before releasing this version.',
			},
			{
				selector:
					'CallExpression[callee.name=/^(__|_n|_nx|_x)$/]:not([arguments.0.type=/^Literal|BinaryExpression$/])',
				message:
					'Translate function arguments must be string literals.',
			},
			{
				selector:
					'CallExpression[callee.name=/^(_n|_nx|_x)$/]:not([arguments.1.type=/^Literal|BinaryExpression$/])',
				message:
					'Translate function arguments must be string literals.',
			},
			{
				selector:
					'CallExpression[callee.name=_nx]:not([arguments.3.type=/^Literal|BinaryExpression$/])',
				message:
					'Translate function arguments must be string literals.',
			},
			{
				selector:
					'CallExpression[callee.name=/^(__|_x|_n|_nx)$/] Literal[value=/\\.{3}/]',
				message: 'Use ellipsis character (…) in place of three dots',
			},
			{
				selector:
					'ImportDeclaration[source.value="lodash"] Identifier.imported[name="memoize"]',
				message: 'Use memize instead of Lodash’s memoize',
			},
			{
				selector:
					'CallExpression[callee.object.name="page"][callee.property.name="waitFor"]',
				message: 'Prefer page.waitForSelector instead.',
			},
			{
				selector:
					'CallExpression[callee.name="withDispatch"] > :function > BlockStatement > :not(VariableDeclaration,ReturnStatement)',
				message:
					'withDispatch must return an object with consistent keys. Avoid performing logic in `mapDispatchToProps`.',
			},
			{
				selector:
					'LogicalExpression[operator="&&"][left.property.name="length"][right.type="JSXElement"]',
				message:
					'Avoid truthy checks on length property rendering, as zero length is rendered verbatim.',
			},
		],
		'react/forbid-elements': [
			'error',
			{
				forbid: [ [ 'rect', 'Rect' ] ].map(
					( [ element, componentName ] ) => {
						return {
							element,
							message: `use cross-platform <${ componentName }> component instead.`,
						};
					}
				),
			},
		],
	},
	overrides: [
		{
			files: [ 'packages/e2e-test*/**/*.js' ],
			env: {
				browser: true,
			},
			globals: {
				browser: true,
				page: true,
				wp: true,
				quillForms: true,
			},
		},

		merge(
			// ESLint doesn't allow the `extends` field inside `overrides`, so we need to compose
			// the TypeScript config manually using internal bits from various plugins
			{},
			// base TypeScript config: parser options, add plugin with rules
			require( '@typescript-eslint/eslint-plugin' ).configs.base,
			// basic recommended rules config from the TypeScript plugin
			{
				rules: require( '@typescript-eslint/eslint-plugin' ).configs
					.recommended.rules,
			},
			// disables rules that are already checked by the TypeScript compiler
			// see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/configs#eslint-recommended
			{
				rules: require( '@typescript-eslint/eslint-plugin' ).configs[
					'eslint-recommended'
				].overrides[ 0 ].rules,
			},
			// Prettier rules config
			require( 'eslint-config-prettier/@typescript-eslint' ),
			// Our own overrides
			{
				files: [ '**/*.ts', '**/*.tsx' ],
				rules: {
					// Disable vanilla eslint rules that have a Typescript implementation
					// See https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/README.md#extension-rules
					'brace-style': 'off',
					'comma-dangle': 'off',
					'comma-spacing': 'off',
					'default-param-last': 'off',
					'dot-notation': 'off',
					'func-call-spacing': 'off',
					indent: 'off',
					'init-declarations': 'off',
					'keyword-spacing': 'off',
					'lines-between-class-members': 'off',
					'no-array-constructor': 'off',
					'no-dupe-class-members': 'off',
					'no-duplicate-imports': 'off',
					'no-empty-function': 'off',
					'no-extra-parens': 'off',
					'no-extra-semi': 'off',
					'no-invalid-this': 'off',
					'no-loop-func': 'off',
					'no-loss-of-precision': 'off',
					'no-magic-numbers': 'off',
					'no-redeclare': 'off',
					'no-shadow': 'off',
					'no-unused-expressions': 'off',
					'no-unused-vars': 'off',
					'no-use-before-define': 'off',
					'no-useless-constructor': 'off',
					quotes: 'off',
					'require-await': 'off',
					'return-await': 'off',
					semi: 'off',
					'space-before-function-paren': 'off',

					'@typescript-eslint/explicit-function-return-type': 'off',
					'@typescript-eslint/explicit-member-accessibility': 'off',
					'@typescript-eslint/no-unused-vars': [
						'error',
						{ ignoreRestSiblings: true },
					],
					'@typescript-eslint/no-use-before-define': [
						'error',
						{ functions: false, typedefs: false },
					],
					'@typescript-eslint/no-var-requires': 'off',
					// REST API objects include underscores
					'@typescript-eslint/camelcase': 'off',
				},
			}
		),
	],
	settings: {
		jsdoc: {
			mode: 'typescript',
		},
	},
};
