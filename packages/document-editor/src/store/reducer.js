import { SET_POST_TITLE, SET_POST_SLUG, SET_POST_CONTENT } from './constants';

/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Reducer managing the post slug
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function postSlug( state = '', action ) {
	switch ( action.type ) {
		case SET_POST_SLUG:
			return action.slug;
	}

	return state;
}

/**
 * Reducer managing the post content
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function postContent( state = '', action ) {
	switch ( action.type ) {
		case SET_POST_CONTENT:
			return action.content;
	}

	return state;
}

/**
 * Reducer managing the post slug
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function postTitle( state = '', action ) {
	switch ( action.type ) {
		case SET_POST_TITLE:
			return action.title;
	}

	return state;
}

export default combineReducers( { postSlug, postContent, postTitle } );
