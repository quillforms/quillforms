import {
	DISABLE_PROGRESS_BAR,
	DISABLE_WHEEL_SWIPING,
	DISABLE_NAVIGATION_ARROWS,
	CHANGE_ANIMATION_DIRECTION,
	DISABLE_ASTREISKS_ON_REQUIRED_FIELDS,
	SETUP_STORE,
	SHOW_LETTERS_ON_ANSWERS,
	SHOW_QUESTIONS_NUMBERS,
	DISPLAY_BRANDING,
	SAVE_ANSWERS_IN_BROWSER,
	ENABLE_AUTO_SUBMIT,
	NAVIGATION_TYPE,

} from './constants';
export const setUpStore = (initialPayload) => {
	return {
		type: SETUP_STORE,
		initialPayload,
	};
};
export const disableProgressBar = (flag) => {
	return {
		type: DISABLE_PROGRESS_BAR,
		flag,
	};
};
export const disableWheelSwiping = (flag) => {
	return {
		type: DISABLE_WHEEL_SWIPING,
		flag,
	};
};

export const disableNavigationArrows = (flag) => {
	return {
		type: DISABLE_NAVIGATION_ARROWS,
		flag,
	};
};

export const changeAnimationDirection = (direction) => {
	return {
		type: CHANGE_ANIMATION_DIRECTION,
		direction,
	};
};

export const showLettersOnAnswers = (flag) => {
	return {
		type: SHOW_LETTERS_ON_ANSWERS,
		flag,
	};
};

export const showQuestionsNumbers = (flag) => {
	return {
		type: SHOW_QUESTIONS_NUMBERS,
		flag,
	};
};

export const saveAnswersInBrowser = (flag) => {
	return {
		type: SAVE_ANSWERS_IN_BROWSER,
		flag
	}
}

export const displayBranding = (flag) => {
	return {
		type: DISPLAY_BRANDING,
		flag
	}
}

export const disableAstreisksOnRequiredFields = (flag) => {
	return {
		type: DISABLE_ASTREISKS_ON_REQUIRED_FIELDS,
		flag
	}
}

export const enableAutoSubmit = (flag) => {
	return {
		type: ENABLE_AUTO_SUBMIT,
		flag
	}
}

export const setNavigationType = (navigationType) => {
	return {
		type: NAVIGATION_TYPE,
		navigationType
	}
}