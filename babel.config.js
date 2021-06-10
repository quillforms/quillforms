module.exports = function (api) {
	api.cache(true);

	return {
	  presets: ["@wordpress/babel-preset-default"],
	  plugins: ["@emotion", "babel-plugin-inline-json-import"],
	};
  };
