/**
 * WordPress Dependencies
 */
import { createContext, useMemo } from '@wordpress/element';
import { noop } from 'lodash';
import { FormObj, CustomFont, SubmissionDispatchers } from '../../types';

interface FormContext {
	formObj: FormObj;
	onSubmit: (data: object, dispatchers: SubmissionDispatchers) => void;
	isPreview: boolean;
	deviceWidth?: string;
	customFonts?: CustomFont[];
	formId?: number;
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
	},
	onSubmit: noop,
	isPreview: false,
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
