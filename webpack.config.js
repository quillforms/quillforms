/**
 * External dependencies
 */
const { DefinePlugin } = require( 'webpack' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const postcss = require( 'postcss' );
const { get, escapeRegExp, compact } = require( 'lodash' );
const { basename, sep } = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

function camelCaseDash( string ) {
	return string.replace( /-([a-z])/g, ( match, letter ) =>
		letter.toUpperCase()
	);
}

const CustomTemplatedPathPlugin = require( '@wordpress/custom-templated-path-webpack-plugin' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );

/**
 * Internal dependencies
 */
const { dependencies } = require( './package' );

const {
	NODE_ENV: mode = 'development',
	WP_DEVTOOL: devtool = mode === 'production' ? false : 'source-map',
} = process.env;

const QUILLFORMS_NAMESPACE = '@quillforms/';

const quillformsPackages = Object.keys( dependencies )
	.filter( ( packageName ) => packageName.startsWith( QUILLFORMS_NAMESPACE ) )
	.map( ( packageName ) => packageName.replace( QUILLFORMS_NAMESPACE, '' ) );

module.exports = {
	...defaultConfig,
	mode,
	entry: quillformsPackages.reduce( ( memo, packageName ) => {
		const name = camelCaseDash( packageName );
		memo[ name ] = `./packages/${ packageName }`;
		return memo;
	}, {} ),
	output: {
		devtoolNamespace: 'quillforms',
		filename: './build/[basename]/index.js',
		path: __dirname,
		library: [ 'quillForms', '[name]' ],
		libraryTarget: 'this',
	},
	module: {
		rules: compact( [
			mode !== 'production' && {
				test: /\.js$/,
				use: require.resolve( 'source-map-loader' ),
				enforce: 'pre',
			},
		] ),
	},
	plugins: [
		new DefinePlugin( {
			'process.env.FORCE_REDUCED_MOTION': JSON.stringify(
				process.env.FORCE_REDUCED_MOTION
			),
		} ),
		new CustomTemplatedPathPlugin( {
			basename( path, data ) {
				let rawRequest;

				const entryModule = get( data, [ 'chunk', 'entryModule' ], {} );
				switch ( entryModule.type ) {
					case 'javascript/auto':
						rawRequest = entryModule.rawRequest;
						break;

					case 'javascript/esm':
						rawRequest = entryModule.rootModule.rawRequest;
						break;
				}

				if ( rawRequest ) {
					return basename( rawRequest );
				}

				return path;
			},
		} ),
		new CopyWebpackPlugin(
			quillformsPackages.map( ( packageName ) => ( {
				from: `./packages/${ packageName }/build-style/*.css`,
				to: `./build/${ packageName }/`,
				flatten: true,
				transform: ( content ) => {
					if ( mode === 'production' ) {
						return postcss( [
							require( 'cssnano' )( {
								preset: [
									'default',
									{
										discardComments: {
											removeAll: true,
										},
									},
								],
							} ),
						] )
							.process( content, {
								from: 'src/app.css',
								to: 'dest/app.css',
							} )
							.then( ( result ) => result.css );
					}
					return content;
				},
			} ) )
		),
		new CopyWebpackPlugin( [
			{
				from: './packages/block-library/src/**/index.php',
				test: new RegExp(
					`([\\w-]+)${ escapeRegExp( sep ) }index\\.php$`
				),
				to: 'build/block-library/blocks/class-qf-[1].php',
			},
			{
				from: './packages/block-library/src/*/block.json',
				test: new RegExp(
					`([\\w-]+)${ escapeRegExp( sep ) }block\\.json$`
				),
				to: 'build/block-library/blocks/[1]/block.json',
			},
		] ),

		...defaultConfig.plugins.filter(
			( plugin ) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new DependencyExtractionWebpackPlugin( {
			useDefaults: true,
			injectPolyfill: true,
			requestToExternal( request ) {
				if ( request.startsWith( QUILLFORMS_NAMESPACE ) ) {
					return [
						'quillForms',
						camelCaseDash(
							request.substring( QUILLFORMS_NAMESPACE.length )
						),
					];
				}
			},
			requestToHandle( request ) {
				if ( request.startsWith( QUILLFORMS_NAMESPACE ) ) {
					return (
						'quillforms-' +
						request.substring( QUILLFORMS_NAMESPACE.length )
					);
				}
			},
		} ),
	],
	watchOptions: {
		ignored: '!packages/*/!(src)/**/*',
	},
	devtool,
};
