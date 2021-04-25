/**
 * QuillForms Dependencies
 */
import type {
	FormBlocks,
	FormMessages,
	FormTheme,
	FormLogic,
} from '@quillforms/config';

export type FormObj = {
	blocks: FormBlocks;
	theme?: Partial< FormTheme >;
	messages?: Partial< FormMessages >;
	logic?: FormLogic;
};
