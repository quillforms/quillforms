const getDefaultThemeProperties = () => {
	return window?.qfEditorContext?.defaults?.theme?.properties
		? window.qfEditorContext.defaults.theme.properties
		: {};
};
export default getDefaultThemeProperties;
