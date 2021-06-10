/**
 * External dependencies
 */
 const { DefinePlugin } = require( 'webpack' );
 const MiniCssExtractPlugin = require( '@automattic/mini-css-extract-plugin-with-rtl' );
 const WebpackRTLPlugin = require( 'webpack-rtl-plugin' );

 const TerserPlugin = require( 'terser-webpack-plugin' );

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

 const quillFormsBlocklibPackages = [
	 '@quillforms/blocklib-date-block',
	 '@quillforms/blocklib-dropdown-block',
	 '@quillforms/blocklib-email-block',
	 '@quillforms/blocklib-long-text-block',
	 '@quillforms/blocklib-multiple-choice-block',
	 '@quillforms/blocklib-number-block',
	 '@quillforms/blocklib-short-text-block',
	 '@quillforms/blocklib-statement-block',
	 '@quillforms/blocklib-website-block',
	 '@quillforms/blocklib-welcome-screen-block',
 ];
 const quillformsPackages = Object.keys( dependencies )
	 .filter( ( packageName ) => packageName.startsWith( QUILLFORMS_NAMESPACE ) )
	 .map( ( packageName ) => packageName.replace( QUILLFORMS_NAMESPACE, '' ) );

 const quillformsPackagesWithoutBlocklib = Object.keys( dependencies )
	 .filter(
		 ( packageName ) =>
			 packageName.startsWith( QUILLFORMS_NAMESPACE ) &&
			 ! quillFormsBlocklibPackages.includes( packageName )
	 )
	 .map( ( packageName ) => packageName.replace( QUILLFORMS_NAMESPACE, '' ) );

 quillformsPackagesWithoutBlocklib.forEach( ( packageName ) => {
	 const name = camelCaseDash( packageName );
	 entryPoints[ name ] = `./packages/${ packageName }`;
 }, {} );

 quillFormsBlocklibPackages.forEach( ( packageName ) => {
	 const name = camelCaseDash(
		 packageName.replace( QUILLFORMS_NAMESPACE, '' )
	 );
	 entryPoints[ `${ name }Admin` ] = `./packages/${ packageName.replace(
		 QUILLFORMS_NAMESPACE,
		 ''
	 ) }/src/admin`;

	 entryPoints[ `${ name }Renderer` ] = `./packages/${ packageName.replace(
		 QUILLFORMS_NAMESPACE,
		 ''
	 ) }/src/renderer`;
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
	 resolve: {
		 mainFields: [ 'browser', 'module', 'main', 'quillforms:src' ],
	 },
	 module: {
		 rules: compact( [
			 mode !== 'production' && {
				 test: /\.js$/,
				 use: require.resolve( 'source-map-loader' ),
				 include: [ path.resolve( __dirname, 'packages' ) ],
				 exclude: [
					 path.resolve( __dirname, 'packages/blocklib-date-block' ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-dropdown-block'
					 ),
					 path.resolve( __dirname, 'packages/blocklib-email-block' ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-long-text-block'
					 ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-multiple-choice-block'
					 ),
					 path.resolve( __dirname, 'packages/blocklib-number-block' ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-short-text-block'
					 ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-statement-block'
					 ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-website-block'
					 ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-welcome-screen-block'
					 ),
				 ],
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
				 include: [
					 path.resolve( __dirname, 'client' ),
					 path.resolve( __dirname, 'packages/blocklib-date-block' ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-dropdown-block'
					 ),
					 path.resolve( __dirname, 'packages/blocklib-email-block' ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-long-text-block'
					 ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-multiple-choice-block'
					 ),
					 path.resolve( __dirname, 'packages/blocklib-number-block' ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-short-text-block'
					 ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-statement-block'
					 ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-website-block'
					 ),
					 path.resolve(
						 __dirname,
						 'packages/blocklib-welcome-screen-block'
					 ),
				 ],
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
							 postcssOptions: {
								 config: path.resolve(__dirname, "postcss.config.js"),
							 },
						 },
					 },
					 {
						 loader: 'sass-loader',
						 options: {
							 additionalData:
								 '@import "packages/base-styles/_colors"; ' +
								 '@import "packages/base-styles/_variables"; ' +
								 '@import "packages/base-styles/_breakpoints"; ' +
								 '@import "packages/base-styles/_mixins"; ',
						 },
					 },
				 ],
			 },
			 {
				 test: /\.tsx?$/,
				 use: [
					 {
						 loader: 'ts-loader',
						 options: {
							 transpileOnly: true,
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
					 if (
						 new RegExp( '(\\w+)-block/src/admin$' ).test(
							 rawRequest
						 )
					 ) {
						 const matches = rawRequest.match(
							 'blocklib-([a-zA-Z-]+)-block/src/admin$'
						 );
						 return `blocklib-${ matches[ 1 ] }-block/admin`;
					 } else if (
						 new RegExp(
							 'blocklib-([a-zA-Z-]+)-block/src/renderer$'
						 ).test( rawRequest )
					 ) {
						 const matches = rawRequest.match(
							 'blocklib-([a-zA-Z-]+)-block/src/renderer$'
						 );
						 return `blocklib-${ matches[ 1 ] }-block/renderer`;
					 }
					 return basename( rawRequest );
				 }

				 return path;
			 },
		 } ),
		 new CopyWebpackPlugin(
			 quillformsPackages.map( ( packageName ) => ( {
				 from: `./packages/${ packageName }/build-style/*.css`,
				 to: `./build/${ packageName }`,
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
				 from: './packages/blocklib-**-block/src/index.php',
				 test: RegExp( 'blocklib-([a-zA-Z-]+)-block/src/index.php$' ),
				 to: 'includes/blocks/[1]/class-qf-[1]-block.php',
			 },
			 {
				 from: './packages/blocklib-**-block/src/block.json',
				 test: RegExp( 'blocklib-([a-zA-Z-]+)-block/src/block.json$' ),
				 to: 'includes/blocks/[1]/block.json',
			 },
			 {
				 from: './packages/config/src/json',
				 to: 'includes/json',
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
				 switch ( request ) {
					 case 'emotion': {
						 return 'emotion';
					 }
					 case 'react-window': {
						 return 'react-window';
					 }
				 }
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
	 optimization: {
		 concatenateModules: mode === 'production',

		 minimize: mode !== 'development',
		 minimizer: [
			 new TerserPlugin( {
				 cache: true,
				 parallel: true,
				 sourceMap: mode !== 'production',
				 terserOptions: {
					 compress: {
						 passes: 2,
					 },
				 },
				 extractComments: false,
			 } ),
		 ],
	 },

	 devtool,
 };
