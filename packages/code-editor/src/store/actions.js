import { SET_CUSTOM_CSS } from './constants';
export const setCustomCSS = ( css ) => {
	return {
		type: SET_CUSTOM_CSS,
		css,
	};
};
