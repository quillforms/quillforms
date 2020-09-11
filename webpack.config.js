/**
 * External dependencies
 */
const { DefinePlugin } = require( 'webpack' );
const MiniCssExtractPlugin = require( '@automattic/mini-css-extract-plugin-with-rtl' );
const WebpackRTLPlugin = require( 'webpack-rtl-plugin' );

const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const postcss = require( 'postcss' );
const { get, escapeRegExp, compact } = require( 'lodash' );
const { basename, sep } = require( 'path' );
const path = require( 'path' );

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
const entryPoints = {};

const quillformsPackages = Object.keys( dependencies )
	.filter( ( packageName ) => packageName.startsWith( QUILLFORMS_NAMESPACE ) )
	.map( ( packageName ) => packageName.replace( QUILLFORMS_NAMESPACE, '' ) );

quillformsPackages.forEach( ( packageName ) => {
	const name = camelCaseDash( packageName );
	entryPoints[ name ] = `./packages/${ packageName }`;
}, {} );

module.exports = {
	...defaultConfig,
	mode,
	entry: {
		client: './client',
		...entryPoints,
	},
	output: {
		devtoolNamespace: 'quillforms',
		filename: './build/[basename]/index.js',
		path: __dirname,
		library: [ 'qf', '[name]' ],
		libraryTarget: 'this',
		chunkFilename: `chunks/[id].[chunkhash].min.js`,
	},
	module: {
		rules: compact( [
			mode !== 'production' && {
				test: /\.js$/,
				use: require.resolve( 'source-map-loader' ),
				include: [ path.resolve( __dirname, 'packages' ) ],
				enforce: 'pre',
			},
			{
				test: /\.jsx?$/,
				use: {
					loader: 'babel-loader?cacheDirectory',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									modules: false,
									targets: {
										browsers: [
											'extends @wordpress/browserslist-config',
										],
									},
								},
							],
						],
						plugins: [
							require.resolve(
								'@babel/plugin-proposal-object-rest-spread'
							),
							require.resolve(
								'@babel/plugin-transform-react-jsx'
							),
							require.resolve(
								'@babel/plugin-proposal-async-generator-functions'
							),
							require.resolve(
								'@babel/plugin-transform-runtime'
							),
							require.resolve(
								'@babel/plugin-proposal-class-properties'
							),
						].filter( Boolean ),
					},
				},
				include: [ path.resolve( __dirname, 'client' ) ],
				exclude: /node_modules/,
			},
			{
				test: /\.s?css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						// postcss loader so we can use autoprefixer and theme Gutenberg components
						loader: 'postcss-loader',
						options: {
							config: {
								path: 'postcss.config.js',
							},
						},
					},
					{
						loader: 'sass-loader',
						options: {
							prependData:
								'@import "packages/base-styles/_colors"; ' +
								'@import "packages/base-styles/_variables"; ' +
								'@import "packages/base-styles/_breakpoints"; ' +
								'@import "packages/base-styles/_mixins"; ',
						},
					},
				],
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
			injectPolyfill: false,
			requestToExternal( request ) {
				if ( request.startsWith( QUILLFORMS_NAMESPACE ) ) {
					return [
						'qf',
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
		new WebpackRTLPlugin( {
			minify: {
				safe: true,
			},
		} ),
		new MiniCssExtractPlugin( {
			filename: './build/[name]/style.css',
			chunkFilename: './build/client/chunks/[id].style.css',
			rtlEnabled: true,
		} ),
	],

	devtool,
};
