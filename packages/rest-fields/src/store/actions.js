import { REGISTER_FORM_META } from './constants';

export const registerFormMeta = ( settings ) => {
	return {
		type: REGISTER_FORM_META,
		settings,
	};
};
