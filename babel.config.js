module.exports = function (api) {
	api.cache(true);

	return {
		presets: ['@wordpress/babel-preset-default'],
		plugins: [
			'@emotion/babel-plugin',
			'babel-plugin-inline-json-import',
			['@quillforms/babel-plugin-makepot', {
				output: 'languages/quillforms-js.pot',
				headers: {
					'Project-Id-Version': 'QuillForms 2.0.0',
					'Last-Translator': 'Mohamed Magdy',
					'Report-Msgid-Bugs-To': 'https://github.com/quillforms/quillforms/issues'
				}
			}]
		]
	};
};