import { SET_POST_TITLE, SET_POST_SLUG } from './constants';
export const setPostTitle = ( title ) => {
	return {
		type: SET_POST_TITLE,
		title,
	};
};

export const setPostSlug = ( slug ) => {
	return {
		type: SET_POST_SLUG,
		slug,
	};
};
