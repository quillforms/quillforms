/**
 * WordPress Dependencies
 */
import { createContext, useMemo } from '@wordpress/element';
import { noop } from 'lodash';
import { FormObj, CustomFont, SubmissionDispatchers } from '../../types';

interface EditorOffConfig {
	mode: "off";
}

interface EditorOnConfig {
	mode: "on";
	editLabel: React.FC;
	editDescription: React.FC;
	onClick: (id: string) => void;
	onChildClick: (id: string) => void;
	isChildActive: (id: string) => boolean;
}


// Create a union type for Editor
type Editor = EditorOnConfig | EditorOffConfig;

interface FormContext {
	formObj: FormObj;
	onSubmit: (data: object, dispatchers: SubmissionDispatchers) => void;
	isPreview: boolean;
	deviceWidth?: string;
	editor: Editor;
	customFonts?: CustomFont[];
	formId?: number | string;
	beforeGoingNext?: ({
		setIsFieldValid,
		setIsPending,
		currentBlockId,
		answers,
		setFieldValidationErr,
		setIsCurrentBlockSafeToSwipe,
		goToBlock,
		goNext,
	}: {
		setIsFieldValid: (id: string, flag: boolean) => void;
		setFieldValidationErr: (id: string, err: string) => void;
		setIsPending: (flag: boolean) => void;
		setIsCurrentBlockSafeToSwipe: (flag: boolean) => void;
		goToBlock: (id: string) => void;
		goNext: () => void;
		currentBlockId: string;
		answers: Record<string, unknown>;
	}) => void;
}
const FormContext: React.Context<FormContext> = createContext<FormContext>({
	formObj: {
		blocks: [],
		messages: {},
		theme: {},
		logic: undefined,
		themesList: [],
		settings: {
			disableProgressBar: false,
			disableWheelSwiping: false,
			animationDirection: 'vertical',
		},
		hiddenFields: {},
		partialSubmissionPoint: undefined, // Add missing property
	},
	onSubmit: noop,
	isPreview: false,
	editor: {
		mode: 'off',
	},
});

const FormContextProvider = ({ children, value }) => {
	const memoizedValue = useMemo(() => value, Object.values(value));

	return (
		<FormContext.Provider value={memoizedValue}>
			{children}
		</FormContext.Provider>
	);
};

export { FormContext, FormContextProvider };
