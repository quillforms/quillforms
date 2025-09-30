/**
 * QuillForms Dependencies
 */
import { sanitizeBlocks } from '@quillforms/blocks';
import { getDefaultMessages } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';

/**
 * Internal Dependencies
 */
import { FormContextProvider } from '../form-context';
import FormWrapper from '../form-wrapper';
import type { FormObj, SubmissionDispatchers, CustomFont } from '../../types';

/**
 * External Dependencies
 */
import { map, shuffle, size } from 'lodash';

// Define the editor properties when mode is "off"
interface EditorOffConfig {
	mode: "off";
}

interface EditorOnConfig {
	mode: "on";
	editLabel: React.FC;
	editDescription: React.FC;
}


// Create a union type for Editor
type Editor = EditorOnConfig | EditorOffConfig;

// Update the main Props interface
interface Props {
	formId?: number | string;
	formObj: FormObj;
	customFonts?: CustomFont[];
	onSubmit: (data: Object, dispatchers: SubmissionDispatchers) => void;
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
	onPartialSubmit?: (data: Object) => void;	// Add onPartialSubmit prop
	applyLogic: boolean;
	isPreview?: boolean;
	editor: Editor;
}

interface Props {
	formId?: number | string;
	formObj: FormObj;
	customFonts?: CustomFont[];
	onSubmit: (data: Object, dispatchers: SubmissionDispatchers) => void;
	onPartialSubmit?: (data: Object) => void;
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
	applyLogic: boolean;

	isPreview?: boolean;

}
const Form: React.FC<Props> = ({
	formObj,
	formId,
	onSubmit,
	editor,
	applyLogic = false,
	beforeGoingNext,
	isPreview = false,
	customFonts,
	onPartialSubmit
}) => {
	const [deviceWidth, setDeviceWidth] = useState('');

	useEffect(() => {
		function handleResize() {
			if (window.innerWidth < 600) {
				setDeviceWidth('mobile');
			} else {
				setDeviceWidth('desktop');
			}
		}

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const formatFormObj = (): FormObj => {
		// If not in preview mode, sanitize blocks.
		// In preview mode, sanitizing is already done in block editor resolvers.
		if (!isPreview) {
			formObj.blocks = sanitizeBlocks(formObj.blocks);
		}

		formObj.messages = {
			...getDefaultMessages(),
			...formObj.messages,
		};
		const ParsedUrlSearch =
			typeof window !== 'undefined'
				? new URLSearchParams(
					window?.location?.search?.substring(1)
				)
				: '';
		if (!formObj.settings) formObj.settings = {};
		formObj.settings = {
			disableProgressBar: false,
			disableWheelSwiping: false,
			disableNavigationArrows: false,
			animationDirection: 'vertical',
			showQuestionsNumbers: true,
			showLettersOnAnswers: true,
			saveAnswersInBrowser: false,
			displayBranding: false,
			disableAstreisksOnRequiredFields: false,
			enableAutoSubmit: false,
			navigationType: 'arrows',

			...formObj.settings,
		};

		formObj.correctIncorrectQuiz = {
			enabled: false,
			questions: {},
			showAnswersDuringQuiz: true,
			...formObj.correctIncorrectQuiz,

		}

		formObj.blocks = map(formObj.blocks, ($block) => {
			if (
				(
					$block.name === 'multiple-choice' ||
					$block.name === 'dropdown' ||
					$block.name === 'picture-choice'
				) &&
				$block?.attributes?.randomize
				&& !isPreview && editor?.mode === 'off'
			) {
				return {
					...$block,
					attributes: {
						...$block.attributes,
						// @ts-expect-error
						choices: shuffle($block?.attributes?.choices ?? [])
					}
				}
			}

			return $block;
		})

		// 'quillforms-redirection' is deprecated and will be removed.
		if (
			size(ParsedUrlSearch) > 0 &&
			// @ts-expect-error
			ParsedUrlSearch?.get('quillforms-shortcode')
		) {
			formObj.settings.disableWheelSwiping = true;
		}
		return formObj;
	};

	useEffect(() => {
		if (!isPreview) {
			doAction('QuillForms.RendererCore.Loaded');
		}
	}, []);

	return (
		<FormContextProvider
			value={{
				formObj: formatFormObj(),
				editor,
				onSubmit,
				isPreview,
				formId,
				beforeGoingNext,
				deviceWidth,
				customFonts,
				onPartialSubmit
			}}
		>
			<FormWrapper applyLogic={applyLogic} />
		</FormContextProvider>
	);
};

export default Form;
