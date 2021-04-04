import { BlockAttributes, FormBlocks } from '@quillforms/config';
import {
	SET_SUBMISSION_ERR,
	SET_SWIPER_STATE,
	COMPLETE_FORM,
	GO_NEXT,
	GO_PREV,
	GO_TO_FIELD,
	INSERT_EMPTY_FIELD_ANSWER,
	SET_FIELD_ANSWER,
	SET_IS_FIELD_VALID,
	SET_FIELD_VALIDATION_ERR,
	SET_IS_FIELD_ANSWERED,
} from './constants';
export type Screen = {
	id: string;
	attributes: BlockAttributes;
};

export type SwiperState = {
	walkPath: FormBlocks;
	welcomeScreens: Screen[];
	thankyouScreens: Screen[];
	currentBlockId: undefined | string;
	nextBlockId: undefined | string;
	lastActiveBlockId: undefined | string;
	prevBlockId: undefined | string;
	canGoNext: boolean;
	canGoPrev: boolean;
	isAnimating: boolean;
	isSubmissionScreenActive: boolean | undefined;
	isThankyouScreenActive: boolean;
	isWelcomeScreenActive: boolean;
	isReviewing: boolean;
	submissionErrors: string[];
};

/**
 * Actions
 */
type setSwiperAction = {
	type: typeof SET_SWIPER_STATE;
	swiperState: Partial< SwiperState >;
};

type goNextAction = {
	type: typeof GO_NEXT;
	isSwiping?: boolean;
};

type goPrevAction = {
	type: typeof GO_PREV;
};

type goToFieldAction = {
	type: typeof GO_TO_FIELD;
	id: string;
};

type setSubmissionErrAction = {
	type: typeof SET_SUBMISSION_ERR;
	err: string;
};

type completeFormAction = {
	type: typeof COMPLETE_FORM;
};

export type Answer = {
	isValid: boolean;
	isAnswered: boolean;
	name: string;
	value: unknown;
	validationErr: string | undefined;
};

export type RendererAnswersState = Record< string, Answer >;

/**
 * Actions
 */
type insertEmptyFieldAnswerAction = {
	type: typeof INSERT_EMPTY_FIELD_ANSWER;
	id: string;
	blockName: string;
};

type setFieldAnswerAction = {
	type: typeof SET_FIELD_ANSWER;
	id: string;
	val: unknown;
};

type setIsFieldValidAction = {
	type: typeof SET_IS_FIELD_VALID;
	id: string;
	val: boolean;
};

type setIsFieldAnsweredAction = {
	type: typeof SET_IS_FIELD_ANSWERED;
	id: string;
	val: boolean;
};

type setIsFieldValidationErr = {
	type: typeof SET_FIELD_VALIDATION_ERR;
	id: string;
	val: string;
};

export type RendererAnswersActionTypes =
	| insertEmptyFieldAnswerAction
	| setFieldAnswerAction
	| setIsFieldValidAction
	| setIsFieldValidationErr
	| setIsFieldAnsweredAction
	| ReturnType< () => { type: 'NOOP' } >;

export type SwiperActionTypes =
	| setSwiperAction
	| goNextAction
	| goPrevAction
	| goToFieldAction
	| setSubmissionErrAction
	| completeFormAction
	| ReturnType< () => { type: 'NOOP' } >;
