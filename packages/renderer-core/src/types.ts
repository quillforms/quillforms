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
	theme?: FormTheme;
	messages?: FormMessages;
	logic?: FormLogic;
};
