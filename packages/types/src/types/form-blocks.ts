type BlockAttachment = {
	type: 'image';
	url: string;
};
type DefaultAttributes = {
	customHTML?: string;
	label?: string;
	description?: string;
	required?: boolean;
	attachment?: BlockAttachment;
	attachmentMaxWidth?: string;
	placeholder?: string | boolean;
	nextBtnLabel?: string | boolean;
	classnames?: string;
	attachmentFocalPoint?: {
		x: number;
		y: number;
	};
	attachmentFancyBorderRadius?: boolean;
	attachmentBorderRadius?: string;
	themeId?: number;
	layout?:
		| 'stack'
		| 'float-left'
		| 'float-right'
		| 'split-left'
		| 'split-right';
};
export interface BlockAttributes extends DefaultAttributes {
	[ x: string ]: unknown;
}

export type FormBlock = {
	id: string;
	name: string;
	attributes?: BlockAttributes;
	innerBlocks?: FormBlock[];
	beforeGoingNext?: ( {
		setIsFieldValid,
		setIsPending,
		currentBlockId,
		answers,
		setFieldValidationErr,
		setIsCurrentBlockSafeToSwipe,
		goToField,
		goNext,
	}: {
		setIsFieldValid: ( id: string, flag: boolean ) => void;
		setFieldValidationErr: ( id: string, err: string ) => void;
		setIsPending: ( flag: boolean ) => void;
		setIsCurrentBlockSafeToSwipe: ( flag: boolean ) => void;
		goToField: ( id: string ) => void;
		goNext: () => void;
		currentBlockId: string;
		answers: Record< string, unknown >;
	} ) => void;
};

export type FormBlocks = FormBlock[];
