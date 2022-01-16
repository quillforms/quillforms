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
	themesList: [
		{
			id: number;
			properties: Partial< FormTheme >;
		}
	];
	theme?: number;
	messages?: Partial< FormMessages >;
	logic?: FormLogic;
};
