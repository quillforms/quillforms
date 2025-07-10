/**
 * QuillForms Dependencies
 */
import type { FormBlock, FormBlocks } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { select } from '@wordpress/data';

/**
 * External Dependencies
 */
import { mapValues, pickBy, find, size, forEach } from 'lodash';

/**
 * Internal Dependencies
 */
import type { State } from './reducer';
import type { RendererAnswersState, Screen, SwiperState } from './types';

export const getBlocksRecursively = (walkPath: FormBlocks): FormBlocks => {
	const allBlocks: FormBlocks = [];
	forEach(walkPath, (block) => {
		allBlocks.push(block);

		if (block.name === 'group' && size(block.innerBlocks) > 0) {
			forEach(block.innerBlocks, (childBlock) => {
				allBlocks.push({
					...childBlock,
					parentId: block.id
				} as FormBlock & { parentId: string }); // Type assertion
			});
		}
	});
	return allBlocks;
};
/**
 * Get swiper state.
 *
 * @param {State} state Global application state.
 *
 * @return {Object} The swiper state
 */
export function getSwiperState(state: State): SwiperState {
	return state.swiper;
}

/**
 * Get walk path.
 *
 * @param {State} state Global application state.
 *
 * @return {Array} Walk path
 */
export function getWalkPath(state: State): FormBlocks {
	return state.swiper.walkPath;
}

/**
 * Is animating
 *
 * @param {State} state Global application state.
 *
 * @return {boolean} Is animating
 */
export function isAnimating(state: State): boolean {
	return state.swiper.isAnimating;
}

/**
 * Get correct incorrect display state
 * 
 * @param {State} state Global application state.
 * 
 * @return {boolean} Correct incorrect display state
 */
export function getCorrectIncorrectDisplay(state: State): boolean {
	return state.swiper.correctIncorrectDisplay;
}


/**
 * Get current block id.
 *
 * @param {State} state Global application state.
 *
 * @return {string}  Current block id
 */
export function getCurrentBlockId(state: State): string | undefined {
	return state.swiper.currentBlockId;
}

/**
 * Get welcome screens.
 *
 * @param {State} state Global application state.
 *
 * @return {Screen[]} Welcome screens
 */
export function getWelcomeScreens(state: State): Screen[] {
	return state.swiper.welcomeScreens;
}

/**
 * Get thank you screens.
 *
 * @param {State} state Global application state.
 *
 * @return {Screen[]} Thank you screens
 */
export function getThankYouScreens(state: State): Screen[] {
	return state.swiper.thankyouScreens;
}

/**
 * Get block by id
 *
 * @param {State}  state Global application state.
 * @param {string} id    The block id.
 *
 * @return {FormBlock } The block
 */
export function getBlockById(
	state: State,
	id: string
): FormBlock | undefined {
	return state.swiper.walkPath.find((block) => block.id === id);
}

/**
 * Is thankyou screen active.
 *
 * @param {State} state Global application state.
 *
 * @return {boolean} Is thankyou screen active
 */
export function isThankyouScreenActive(state: State): boolean {
	return state.swiper.isThankyouScreenActive;
}

/**
 * Is welcome screen active.
 *
 * @param {State} state Global application state.
 *
 * @return {boolean} Is welcome screen active
 */
export function isWelcomeScreenActive(state: State): boolean {
	return state.swiper.isWelcomeScreenActive;
}

/**
 * Is Current Block Safe to Swipe
 *
 * @param {State} state Global application state.
 *
 * @return {boolean} Is submitting
 */
export function isCurrentBlockSafeToSwipe(state: State): boolean {
	return state.swiper.isCurrentBlockSafeToSwipe;
}

/**
 * Is reviewing
 *
 * @param {State} state Global application state.
 *
 * @return {boolean} Is reviewing
 */
export function isReviewing(state: State): boolean {
	return state.submit.isReviewing;
}

/**
 * Is submitting
 *
 * @param {State} state Global application state.
 *
 * @return {boolean} Is submitting
 */
export function isSubmitting(state: State): boolean {
	return state.submit.isSubmitting;
}

/**
 * Get payment data.
 *
 * @param {State} state Global application state.
 *
 * @return {boolean} Is payment modal active
 */
export function getPaymentData(state: State): boolean {
	return state.submit.paymentData;
}

/**
 * Get block counter value
 *
 * @param {State}  state Global application state.
 * @param {string} id    Block id.
 *
 * @return {?number} The block counter value.
 */
export function getBlockCounterValue(
	state: State,
	id: string
): number | undefined {
	const blocksWithCounter = getFieldsBySupportCriteria(state, [
		'editable',
		'innerBlocks',
	]);
	const counterValue = blocksWithCounter.findIndex(
		(editableField) => editableField.id === id
	);
	if (counterValue === -1) return undefined;
	return counterValue;
}
/**
 * Get current path editable fields
 *
 * @param {State} state Global application state.
 *
 * @return {Array} The editable fields in current path
 */
export const getEditableFieldsInCurrentPath = (state: State) => {
	return state.swiper.walkPath.filter((block) => {
		return select('quillForms/blocks').hasBlockSupport(
			block.name,
			'editable'
		);
	});
};

/**
 *
 * Get Fields by support criteria
 *
 * @param {State} state           Global application state.
 * @param {Array} supportCriteria The block type support criteria.
 *
 * @return {Array} The  fields in current path with the support criteria passed.
 */
export const getFieldsBySupportCriteria = (state: State, supportCriteria) => {
	const blockTypesSelector = select('quillForms/blocks');
	return state.swiper.walkPath.filter((block) => {
		let matched = false;
		supportCriteria.forEach((feature) => {
			if (
				blockTypesSelector.hasBlockSupport(block.name, feature) ===
				true
			) {
				matched = true;
			}
		});

		return matched;
	});
};

/**
 * Get all answers.
 *
 * @param {State} state Global application state.
 *
 * @return {RendererAnswersState} Answers
 */
export function getAnswers(state: State): RendererAnswersState {
	return state.answers;
}

/**
 * Get answers values.
 *
 * @param {RendererAnswersState} state Global application state.
 *
 * @return {Object} Answers values
 *
 */
export function getAnswersValues(state: State): Record<string, unknown> {
	return mapValues(state.answers, (o) => {
		return o.value;
	});
}


/**
 * Get count of answered fields.
 *
 * @param {State} state
 *
 * @return {number} Answered fields count
 */
export function getAnsweredFieldsLength(state: State): number {
	const answeredFields = pickBy(
		state.answers,
		(value) => value?.isAnswered === true
	);
	return answeredFields ? size(answeredFields) : 0;
}

/**
 * Get field answer value.
 *
 * @param {State}  state Global application state.
 * @param {string} id    Field id.
 *
 * @return {unknown} Field answer value
 */
export function getFieldAnswerVal(state: State, id: string): unknown {
	const answer = state.answers[id]?.value;
	return answer;
}

/**
 * Get invalid fields
 *
 * @param {State} state
 *
 * @return {Partial< RendererAnswersState >} Invalid fields keyed by id
 */
export function getInvalidAnswers(
	state: State
): Partial<RendererAnswersState> {
	const invalidFields = pickBy(state.answers, (o) => o.isValid === false);
	return invalidFields;
}

/**
 * Get invalid fields length
 *
 * @param {State} state
 *
 * @return {number} Invalid fields length
 */
export function getInvalidFieldsLength(state: State): number {
	return size(getInvalidAnswers(state));
}

/**
 * Get first invalid field id
 *
 * @param {State} state
 *
 * @return {?string} First invalid field id
 */
export const getFirstInvalidFieldId = (state: State): string | undefined => {
	const invalidFields = getInvalidAnswers(state);
	if (size(invalidFields) > 0) {
		const invalidFieldsIds = Object.keys(invalidFields);
		const walkPath = getBlocksRecursively(getWalkPath(state));
		const firstField = find(walkPath, (o) =>
			invalidFieldsIds.includes(o.id)
		);
		if (firstField) return firstField.id;
	}
	return undefined;
};

/**
 * Is answered field.
 *
 * @param {State}  state Global application state.
 * @param {string} id    Field id.
 *
 * @return {boolean} showErr flag
 */
export function isAnsweredField(state: State, id: string): boolean {
	return state.answers[id]?.isAnswered === true;
}

/**
 * Is valid field.
 *
 * @param {State}  state Global application state.
 * @param {string} id    Field id.
 *
 * @return {boolean} showErr flag
 */
export function isValidField(state: State, id: string): boolean {
	return state.answers[id]?.isValid;
}

/**
 * Has valid fields.
 * This for blocks that support inner blocks like group.
 *
 * @param {State}  state Global application state.
 * @param {string} id    Field id.
 *
 * @return {boolean} showErr flag
 */
export function hasValidFields(state: State, id: string): boolean {
	const block = getBlockById(state, id);
	if (!block) return false;
	let isValid = true;
	if (size(block?.innerBlocks) > 0) {
		forEach(block.innerBlocks, ($block) => {
			const blockType = select('quillForms/blocks').getBlockType($block.name);
			if (blockType?.supports?.editable) {
				const $blockId = $block.id;
				if (!state.answers?.[$blockId]?.isValid) {
					isValid = false;
				}
			}
		});
	}
	return isValid;
}

/**
 * Is field answer correct
 * @param state 
 * @param id 
 */
export function isFieldAnswerCorrect(state: State, id: string): boolean | undefined {
	return state.answers[id]?.isCorrect;
}


/**
 * Is field answer locked
 * 
 * @param state
 * @param id
 */
export function isFieldAnswerLocked(state: State, id: string): boolean | undefined {
	return state.answers[id]?.isLocked;
}

/**
 * Is field Correct Incorrect Screen Displayed
 * 
 * @param state
 * @param id
 */
export function isFieldCorrectIncorrectScreenDisplayed(state: State, id: string): boolean | undefined {
	return state.answers[id]?.isCorrectIncorrectScreenDisplayed;
}

/**
 * Is field pending.
 *
 * @param {State}  state Global application state.
 * @param {string} id    Field id.
 *
 * @return {boolean} isPending flag.
 */
export function isFieldPending(state: State, id: string): boolean {
	return state.answers[id]?.isPending;
}

/**
 * Get pending message if pending.
 *
 * @param {State}  state Global application state.
 * @param {string} id    Field id.
 *
 * @return {string|false} Pending message if pending, or false.
 */
export function getPendingMsg(state: State): string | false {
	for (const answer of Object.values(state.answers)) {
		if (answer?.isPending) return answer.pendingMsg ?? '';
	}
	return false;
}

/**
 * Get field validation error message.
 *
 * @param {State}  state Global application state.
 * @param {string} id    Field id.
 *
 * @return {string} Field validation error message
 */
export function getFieldValidationErr(state: State, id: string): string | [] {
	const validationErr = state.answers[id]?.validationErr;
	return validationErr ? validationErr : [];
}

/**
 * Get is focused flag
 *
 * @param {State} state Global application state.
 *
 * @return {boolean} isFocused flag
 */
export function isFocused(state: State): boolean {
	return state.isFocused;
}

/**
 * Should footer be displayed flag
 *
 * @param {State} state Global application state.
 *
 * @return {boolean} isFocused flag
 */
export function shouldFooterBeDisplayed(state: State): boolean {
	return state.footerDisplay;
}

/**
 * Get submission error message
 *
 * @param {State} state Global application state.
 *
 * @return {string} submission error message
 */
export function getSubmissionErr(state: State): string {
	return state.submit.submissionErr;
}

/**
 * Get correct answers count
 * 
 * @param {State} state Global application state.
 * 
 * @return {number} correct answers count
 */
export function getCorrectAnswersCount(state: State): number {
	// access answers object and filter correct answers
	return Object.values(state.answers).filter((answer) => answer.isCorrect === true).length;
}


/**
 * Get incorrect answers count
 * 
 * @param {State} state Global application state.
 * 
 * @return {number} incorrect answers count
 */
export function getIncorrectAnswersCount(state: State): number {
	// access answers object and filter incorrect answers
	return Object.values(state.answers).filter((answer) => answer.isCorrect === false).length;
}


/**
 * Get global hash
 * 
 * @param {State} state Global application state.
 * 
 * @return {string} global hash
 */
export function getGlobalHash(state: State): string {
	return state.submit.globalHash;
}