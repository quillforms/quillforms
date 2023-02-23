import {
	DISABLE_PROGRESS_BAR,
	DISABLE_WHEEL_SWIPING,
	DISABLE_NAVIGATION_ARROWS,
	CHANGE_ANIMATION_DIRECTION,
	SETUP_STORE,
	SHOW_LETTERS_ON_ANSWERS,
	SHOW_QUESTIONS_NUMBERS,
} from './constants';
export const setUpStore = ( initialPayload ) => {
	return {
		type: SETUP_STORE,
		initialPayload,
	};
};
export const disableProgressBar = ( flag ) => {
	return {
		type: DISABLE_PROGRESS_BAR,
		flag,
	};
};
export const disableWheelSwiping = ( flag ) => {
	return {
		type: DISABLE_WHEEL_SWIPING,
		flag,
	};
};

export const disableNavigationArrows = ( flag ) => {
	return {
		type: DISABLE_NAVIGATION_ARROWS,
		flag,
	};
};

export const changeAnimationDirection = ( direction ) => {
	return {
		type: CHANGE_ANIMATION_DIRECTION,
		direction,
	};
};

export const showLettersOnAnswers = ( flag ) => {
	console.log( flag );
	return {
		type: SHOW_LETTERS_ON_ANSWERS,
		flag,
	};
};

export const showQuestionsNumbers = ( flag ) => {
	return {
		type: SHOW_QUESTIONS_NUMBERS,
		flag,
	};
};
