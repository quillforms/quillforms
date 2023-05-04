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
import type { FormObj, SubmissionDispatchers } from '../../types';

/**
 * External Dependencies
 */
import { size } from 'lodash';

interface Props {
	formId: number;
	formObj: FormObj;
	onSubmit: ( data: Object, dispatchers: SubmissionDispatchers ) => void;
	beforeGoingNext?: ( {
		setIsFieldValid,
		setIsPending,
		currentBlockId,
		answers,
		setFieldValidationErr,
		setIsCurrentBlockSafeToSwipe,
		goToBlock,
		goNext,
	}: {
		setIsFieldValid: ( id: string, flag: boolean ) => void;
		setFieldValidationErr: ( id: string, err: string ) => void;
		setIsPending: ( flag: boolean ) => void;
		setIsCurrentBlockSafeToSwipe: ( flag: boolean ) => void;
		goToBlock: ( id: string ) => void;
		goNext: () => void;
		currentBlockId: string;
		answers: Record< string, unknown >;
	} ) => void;
	applyLogic: boolean;
	isPreview: boolean;
}
const Form: React.FC< Props > = ( {
	formObj,
	formId,
	onSubmit,
	applyLogic,
	beforeGoingNext,
	isPreview = false,
} ) => {
	const [ deviceWidth, setDeviceWidth ] = useState( '' );

	useEffect( () => {
		function handleResize() {
			if ( window.innerWidth < 600 ) {
				setDeviceWidth( 'mobile' );
			} else {
				setDeviceWidth( 'desktop' );
			}
		}

		window.addEventListener( 'resize', handleResize );
		handleResize();

		return () => window.removeEventListener( 'resize', handleResize );
	}, [] );

	const formatFormObj = (): FormObj => {
		// If not in preview mode, sanitize blocks.
		// In preview mode, sanitizing is already done in block editor resolvers.
		if ( ! isPreview ) {
			formObj.blocks = sanitizeBlocks( formObj.blocks );
		}

		formObj.messages = {
			...getDefaultMessages(),
			...formObj.messages,
		};
		const ParsedUrlSearch =
			typeof window !== 'undefined'
				? new URLSearchParams(
						window?.location?.search?.substring( 1 )
				  )
				: '';
		if ( ! formObj.settings ) formObj.settings = {};
		formObj.settings = {
			disableProgressBar: false,
			disableWheelSwiping: false,
			disableNavigationArrows: false,
			animationDirection: 'vertical',
			showQuestionsNumbers: true,
			showLettersOnAnswers: true,
			...formObj.settings,
		};
		// 'quillforms-redirection' is deprecated and will be removed.
		if (
			size( ParsedUrlSearch ) > 0 &&
			// @ts-expect-error
			ParsedUrlSearch?.get( 'quillforms-shortcode' )
		) {
			formObj.settings.disableWheelSwiping = true;
		}
		return formObj;
	};

	useEffect( () => {
		if ( ! isPreview ) {
			doAction( 'QuillForms.RendererCore.Loaded' );
		}
	}, [] );

	return (
		<FormContextProvider
			value={ {
				formObj: formatFormObj(),
				onSubmit,
				isPreview,
				formId,
				beforeGoingNext,
				deviceWidth,
			} }
		>
			<FormWrapper applyLogic={ applyLogic } />
		</FormContextProvider>
	);
};

export default Form;
