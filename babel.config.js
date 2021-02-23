module.exports = function( api ) {
	api.cache( true );

	return {
		presets: [ '@wordpress/babel-preset-default', '@babel/preset-typescript' ],
		plugins: [ 'babel-plugin-emotion', 'babel-plugin-inline-json-import' ],
	};
};
