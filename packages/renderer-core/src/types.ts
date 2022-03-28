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
	themesList: Theme[];
	theme: Partial< FormTheme >;
	messages?: Partial< FormMessages >;
	logic?: FormLogic;
	settings: {
		disableProgressBar?: boolean;
		disableWheelSwiping?: boolean;
		disableNavigationArrows?: boolean;
		animationDirection: 'vertical' | 'horizontal';
	};
};
