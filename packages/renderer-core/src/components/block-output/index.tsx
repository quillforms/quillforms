/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, useCallback } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useFieldRenderContext } from '../field-render';
import useBlockTypes from '../../hooks/use-block-types';
import BlockFooter from '../block-footer';

const BlockOutput = ( { isShaking, setIsShaking } ) => {
	const {
		id,
		isFocused,
		next,
		blockName,
		isActive,
		attributes,
		blockFooterArea,
		setBlockFooterArea,
	} = useFieldRenderContext();
	let timer1: ReturnType< typeof setTimeout >,
		timer2: ReturnType< typeof setTimeout >;

	if ( ! blockName || ! id ) return null;
	const blockTypes = useBlockTypes();
	const blockType = blockTypes[ blockName ];
	const [ shakingErr, setShakingErr ] = useState( null );

	const { isCurrentBlockEditable } = useSelect( ( select ) => {
		return {
			isCurrentBlockEditable: select(
				'quillForms/blocks'
			).hasBlockSupport( blockName, 'editable' ),
		};
	} );
	const { answerValue, isValid } = useSelect( ( select ) => {
		return {
			answerValue: isCurrentBlockEditable
				? select( 'quillForms/renderer-core' ).getFieldAnswerVal( id )
				: null,
			isValid: isCurrentBlockEditable
				? select( 'quillForms/renderer-core' ).isValidField( id )
				: null,
		};
	} );

	useEffect( () => {
		clearTimeout( timer1 );
		clearTimeout( timer2 );
		if ( isShaking ) setIsShaking( false );
		if ( shakingErr ) setShakingErr( null );
	}, [ answerValue ] );

	const shakeWithError = useCallback(
		( err ) => {
			clearTimeout( timer1 );
			clearTimeout( timer2 );
			if ( ! isShaking ) setIsShaking( true );
			if ( ! shakingErr ) setShakingErr( err );
			stopShaking();
		},
		[ isActive ]
	);

	const stopShaking = () => {
		timer1 = setTimeout( () => {
			setIsShaking( false );
		}, 600 );
		timer2 = setTimeout( () => {
			setShakingErr( null );
		}, 1200 );
	};

	const showSubmitBtn = ( val ) => {
		setBlockFooterArea( val ? 'submit-btn' : undefined );
	};

	const showErrorMessage = ( val ) => {
		setBlockFooterArea( val ? 'error-message' : undefined );
	};

	const isSubmitBtnVisible = blockFooterArea === 'submit-btn';
	const isErrMsgVisible = blockFooterArea === 'error-message';

	const {
		setIsFieldValid,
		setFieldValidationErrr,
		setIsFieldAnswered,
		setFieldAnswer,
	} = useDispatch( 'quillForms/renderer-core' );

	const goNext = () => {
		if ( ! isValid ) {
			showErrorMessage( true );
		} else {
			next();
		}
	};

	const props = {
		id,
		next: goNext,
		attributes,
		isFocused,
		isActive,
		isValid,
		val: answerValue,
		setIsValid: ( val: boolean ) => setIsFieldValid( id, val ),
		setIsAnswered: ( val: boolean ) => setIsFieldAnswered( id, val ),
		setValidationErr: ( val: string ) => setFieldValidationErrr( id, val ),
		setVal: ( val: string ) => setFieldAnswer( id, val ),
		showErrorMessage: ( val: boolean ) => showErrorMessage( val ),
		showSubmitBtn: ( val: boolean ) => showSubmitBtn( val ),
		shakeWithError: ( err: string ) => shakeWithError( err ),
	};

	return (
		<div
			role="presentation"
			className="renderer-components-block-output"
			onKeyDown={ ( e ) => {
				if ( e.key === 'Enter' ) {
					e.stopPropagation();
					goNext();
				}
			} }
		>
			{ blockType?.output && <blockType.output { ...props } /> }
			<BlockFooter
				isSubmitBtnVisible={ isSubmitBtnVisible }
				isErrMsgVisible={ isErrMsgVisible }
				showErrorMessage={ showErrorMessage }
				shakingErr={ shakingErr }
			/>
		</div>
	);
};
export default BlockOutput;
