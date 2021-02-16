import { SET_POST_TITLE, SET_POST_SLUG, SET_POST_CONTENT } from './constants';
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

export const setPostContent = ( content ) => {
	return {
		type: SET_POST_CONTENT,
		content,
	};
};
