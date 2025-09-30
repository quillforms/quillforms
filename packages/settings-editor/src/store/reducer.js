import {
	DISABLE_PROGRESS_BAR,
	DISABLE_NAVIGATION_ARROWS,
	DISABLE_WHEEL_SWIPING,
	CHANGE_ANIMATION_DIRECTION,
	SHOW_QUESTIONS_NUMBERS,
	SHOW_LETTERS_ON_ANSWERS,
	DISABLE_ASTREISKS_ON_REQUIRED_FIELDS,
	SAVE_ANSWERS_IN_BROWSER,
	ENABLE_AUTO_SUBMIT,
	SETUP_STORE,
	DISPLAY_BRANDING,
	NAVIGATION_TYPE,
} from './constants';


/**
 * Quill Forms Dependencies
 */
import ConfigAPI from '@quillforms/config';

/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Disable progress bar reducer
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function disableProgressBar(state = false, action) {
	switch (action.type) {
		case DISABLE_PROGRESS_BAR:
			return action.flag;

		case SETUP_STORE: {
			return action.initialPayload?.disableProgressBar
				? action.initialPayload?.disableProgressBar
				: false;
		}
	}

	return state;
}
/**
 * Disable Wheel swiping
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function disableWheelSwiping(state = false, action) {
	switch (action.type) {
		case DISABLE_WHEEL_SWIPING:
			return action.flag;

		case SETUP_STORE: {
			return action.initialPayload?.disableWheelSwiping
				? action.initialPayload?.disableWheelSwiping
				: false;
		}
	}

	return state;
}

/**
 * Disable Navigation Arrows.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function disableNavigationArrows(state = false, action) {
	switch (action.type) {
		case DISABLE_NAVIGATION_ARROWS:
			return action.flag;

		case SETUP_STORE: {
			return action.initialPayload?.disableNavigationArrows
				? action.initialPayload?.disableNavigationArrows
				: false;
		}
	}

	return state;
}

/**
 * Show letters on answers.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function showLettersOnAnswers(state = true, action) {
	switch (action.type) {
		case SHOW_LETTERS_ON_ANSWERS:
			return action.flag;

		case SETUP_STORE: {
			return typeof action.initialPayload?.showLettersOnAnswers !==
				'undefined'
				? action.initialPayload?.showLettersOnAnswers
				: true;
		}
	}

	return state;
}

/**
 * Save answers in browser.
 * 
 * @param { Object } state current state.
 * @param { Object } action Dispatched action.
 * 
 * @return { Object } updated state.
 */
export function saveAnswersInBrowser(state = false, action) {
	switch (action.type) {
		case SAVE_ANSWERS_IN_BROWSER:
			return action.flag;

		case SETUP_STORE: {
			return action.initialPayload?.saveAnswersInBrowser
				? action.initialPayload?.saveAnswersInBrowser
				: false;
		}
	}

	return state;
}
/**
 * Show questions numbers.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function showQuestionsNumbers(state = true, action) {
	switch (action.type) {
		case SHOW_QUESTIONS_NUMBERS:
			return action.flag;

		case SETUP_STORE: {
			return typeof action.initialPayload?.showQuestionsNumbers !==
				'undefined'
				? action.initialPayload?.showQuestionsNumbers
				: true;
		}
	}

	return state;
}

/**
 * Show questions numbers.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function displayBranding(state = false, action) {

	switch (action.type) {
		case DISPLAY_BRANDING:
			return action.flag;

		case SETUP_STORE: {
			return typeof action.initialPayload?.displayBranding !==
				'undefined'
				? action.initialPayload?.displayBranding
				: false;
		}
	}

	return state;
}

/**
 * Change animation direction.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function animationDirection(state = false, action) {
	switch (action.type) {
		case CHANGE_ANIMATION_DIRECTION:
			return action.direction;

		case SETUP_STORE: {
			return action.initialPayload?.animationDirection
				?? 'vertical';
		}
	}

	return state;
}

/**
 * Disable Astreisks on required fields.
 * 
 * @param { Object } state current state.
 * @param { Object } action Dispatched action.
 * 
 * @return { Object } updated state.
 */
export function disableAstreisksOnRequiredFields(state = false, action) {
	switch (action.type) {
		case DISABLE_ASTREISKS_ON_REQUIRED_FIELDS:
			return action.flag;

		case SETUP_STORE: {
			return action.initialPayload?.disableAstreisksOnRequiredFields
				? action.initialPayload?.disableAstreisksOnRequiredFields
				: false;
		}
	}

	return state;
}

export function enableAutoSubmit(state = false, action) {
	switch (action.type) {
		case ENABLE_AUTO_SUBMIT:
			return action.flag;

		case SETUP_STORE: {
			return action.initialPayload?.enableAutoSubmit
				? action.initialPayload?.enableAutoSubmit
				: false;
		}
	}

	return state;
}

export function navigationType(state = 'arrows', action) {
	switch (action.type) {
		case NAVIGATION_TYPE:
			return action.navigationType;

		case SETUP_STORE: {
			return action.initialPayload?.navigationType
				? action.initialPayload?.navigationType
				: 'arrows';
		}
	}

	return state;
}


export default combineReducers({
	disableProgressBar,
	disableWheelSwiping,
	disableNavigationArrows,
	animationDirection,
	showLettersOnAnswers,
	showQuestionsNumbers,
	saveAnswersInBrowser,
	displayBranding,
	enableAutoSubmit,
	disableAstreisksOnRequiredFields,
	navigationType
});
