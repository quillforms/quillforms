import { BlockAttributes, FormBlocks } from '@quillforms/types';
import {
	SET_SUBMISSION_ERR,
	SET_SWIPER_STATE,
	COMPLETE_FORM,
	GO_NEXT,
	GO_PREV,
	GO_TO_BLOCK,
	INSERT_EMPTY_FIELD_ANSWER,
	SET_FIELD_ANSWER,
	SET_IS_FIELD_VALID,
	SET_FIELD_VALIDATION_ERR,
	SET_IS_FIELD_ANSWERED,
	SET_IS_FIELD_PENDING,
	SET_FIELD_PENDING_MSG,
	RESET_ANSWERS,
	SET_IS_REVIEWING,
	SET_IS_SUBMITTING,
} from './constants';
export type Screen = {
	id: string;
	attributes?: BlockAttributes;
};

export type SwiperState = {
	walkPath: FormBlocks;
	welcomeScreens: Screen[];
	thankyouScreens: Screen[];
	currentBlockId: undefined | string;
	nextBlockId: undefined | string;
	lastActiveBlockId: undefined | string;
	prevBlockId: undefined | string;
	canSwipeNext: boolean;
	canSwipePrev: boolean;
	isAnimating: boolean;
	isThankyouScreenActive: boolean;
	isWelcomeScreenActive: boolean;
};

export type SubmissionState = {
	isReviewing: boolean;
	isSubmitting: boolean;
	submissionErr: string;
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

type goTonextBtn = {
	type: typeof GO_TO_BLOCK;
	id: string;
};

type completeFormAction = {
	type: typeof COMPLETE_FORM;
};

export type Answer = {
	isValid: boolean;
	isAnswered: boolean;
	isPending: boolean;
	pendingMsg: string | undefined;
	blockName: string;
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

type setIsFieldPendingAction = {
	type: typeof SET_IS_FIELD_PENDING;
	id: string;
	val: boolean;
};

type setFieldPendingMsg = {
	type: typeof SET_FIELD_PENDING_MSG;
	id: string;
	val: string;
};

type setFieldValidationErr = {
	type: typeof SET_FIELD_VALIDATION_ERR;
	id: string;
	val: string;
};

type resetAnswers = {
	type: typeof RESET_ANSWERS;
};

type setIsReviewing = {
	type: typeof SET_IS_REVIEWING;
	val: boolean;
};

type setIsSubmitting = {
	type: typeof SET_IS_SUBMITTING;
	val: boolean;
};

type setSumbissionErr = {
	type: typeof SET_SUBMISSION_ERR;
	val: string;
};
export type RendererAnswersActionTypes =
	| insertEmptyFieldAnswerAction
	| setFieldAnswerAction
	| setIsFieldValidAction
	| setFieldValidationErr
	| setIsFieldAnsweredAction
	| setIsFieldPendingAction
	| setFieldPendingMsg
	| resetAnswers
	| ReturnType< () => { type: 'NOOP' } >;

export type SwiperActionTypes =
	| setSwiperAction
	| goNextAction
	| goPrevAction
	| goTonextBtn
	| completeFormAction
	| ReturnType< () => { type: 'NOOP' } >;

export type SubmitActionTypes =
	| setIsReviewing
	| setIsSubmitting
	| setSumbissionErr
	| completeFormAction
	| ReturnType< () => { type: 'NOOP' } >;
