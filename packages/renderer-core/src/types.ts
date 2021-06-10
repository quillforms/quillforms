/**
 * QuillForms Dependencies
 */
import type {
	FormBlocks,
	FormMessages,
	FormTheme,
	FormLogic,
} from '@quillforms/types';

export type FormObj = {
	blocks: FormBlocks;
	theme?: Partial< FormTheme >;
	messages?: Partial< FormMessages >;
	logic?: FormLogic;
};
