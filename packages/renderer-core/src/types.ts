/**
 * QuillForms Dependencies
 */
import type {
	FormBlocks,
	FormMessages,
	FormTheme,
	FormLogic,
} from '@quillforms/types';

type Theme = {
	id: number;
	properties: Partial< FormTheme >;
};
export type FormObj = {
	blocks: FormBlocks;
	themesList?: Theme[];
	theme?: Partial< FormTheme >;
	messages?: Partial< FormMessages >;
	logic?: FormLogic;
	settings?: {
		disableProgressBar?: boolean;
		disableWheelSwiping?: boolean;
		disableNavigationArrows?: boolean;
		animationDirection?: 'vertical' | 'horizontal';
		showQuestionsNumbers?: boolean;
		showLettersOnAnswers?: boolean;
	};
	hiddenFields?: Object;
	customCSS?: string;
};

export type SubmissionDispatchers = {
	setIsSubmitting: ( flag: boolean ) => void;
	setIsReviewing: ( flag: boolean ) => void;
	goToBlock: ( id: string ) => void;
	setIsFieldValid: ( id: string, flag: boolean ) => void;
	setFieldValidationErr: ( id: string, err: string ) => void;
	completeForm: () => void;
	setSubmissionErr: ( value: string ) => void;
	setIsPending: ( flag: boolean ) => void;
};

type FontVariation = {
	weight: number;
	style: string;
	files?: {
		woff?: string;
		woff2?: string;
		eot?: string;
		ttf?: string;
		svg?: string;
	}
}
export type CustomFont = {
	title: string;
	properties?: {
		variations?: FontVariation[];
	}
}