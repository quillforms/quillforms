export function getSettings(state) {
	return state;
}
export function isProgressBarDisabled(state) {
	return state.disableProgressBar;
}
export function isWheelSwipingDisabled(state) {
	return state.disableWheelSwiping;
}
export function isNavigationArrowsDisabled(state) {
	return state.disableNavigationArrows;
}

export function getAnimationDirection(state) {
	return state.animationDirection;
}

export function shouldLettersOnAnswersBeDisplayed(state) {
	return state.showLettersOnAnswers;
}

export function shouldQuestionsNumbersBeDisplayed(state) {
	return state.showQuestionsNumbers;
}

export function shouldAnswersBeSavedInBrowser(state) {
	return state.saveAnswersInBrowser;
}

export function shouldBrandingBeDisplayed(state) {
	return state.displayBranding;
}

export function shouldAstreisksOnRequiredFieldsBeHidden(state) {
	return state.disableAstreisksOnRequiredFields;
}