/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useFieldRenderContext } from '../field-render';
import useBlockTypes from '../hooks/use-block-types';
import BlockFooter from '../block-footer';

let timer1, timer2;
const BlockOutput = ( { next, isFocused, setIsShaking } ) => {
	const { field, isActive } = useFieldRenderContext();
	const blockTypes = useBlockTypes();
	const blockType = blockTypes[ field.type ];
	const [ footerSectionToShow, setFooterSectionToShow ] = useState( null );
	const [ shakingErr, setShakingErr ] = useState( null );

	const { id } = field;
	const { isCurrentBlockEditable } = useSelect( ( select ) => {
		return {
			isCurrentBlockEditable: select(
				'quillForms/blocks'
			).hasBlockSupport( field.type, 'editable' ),
		};
	} );
	const { answerValue, isValid } = useSelect( ( select ) => {
		return {
			answerValue: isCurrentBlockEditable
				? select( 'quillForms/renderer-submission' ).getFieldAnswerVal(
						id
				  )
				: null,
			isValid: isCurrentBlockEditable
				? select( 'quillForms/renderer-submission' ).isValidField( id )
				: null,
		};
	} );

	const shakeWithError = ( err ) => {
		clearTimeout( timer1 );
		clearTimeout( timer2 );
		setIsShaking( true );
		setShakingErr( err );
		timer1 = setTimeout( () => {
			setIsShaking( false );
		}, 600 );
		timer2 = setTimeout( () => {
			setShakingErr( null );
		}, 1800 );
	};

	const showSubmitBtn = ( val ) => {
		setFooterSectionToShow( val ? 'submit-btn' : null );
	};

	const showErrorMessage = ( val ) => {
		setFooterSectionToShow( val ? 'error-message' : null );
	};

	const isSubmitBtnVisible = footerSectionToShow === 'submit-btn';
	const isErrMsgVisible = footerSectionToShow === 'error-message';

	const {
		setIsFieldValid,
		setFieldValidationErrr,
		setIsFieldAnswered,
		setFieldAnswer,
	} = useDispatch( 'quillForms/renderer-submission' );

	const goNext = () => {
		if ( ! isValid ) {
			showErrorMessage( true );
		} else {
			next();
		}
	};

	const props = {
		next: goNext,
		attributes: field.attributes,
		required: field.required,
		isFocused,
		isActive,
		isValid,
		val: answerValue,
		setIsValid: ( val ) => setIsFieldValid( field.id, val ),
		setIsAnswered: ( val ) => setIsFieldAnswered( field.id, val ),
		setValidationErr: ( val ) => setFieldValidationErrr( field.id, val ),
		setVal: ( val ) => setFieldAnswer( field.id, val ),
		showErrorMessage: ( val ) => showErrorMessage( val ),
		showSubmitBtn: ( val ) => showSubmitBtn( val ),
		shakeWithError: ( err ) => shakeWithError( err ),
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
			{ blockType?.rendererConfig?.output && (
				<blockType.rendererConfig.output { ...props } />
			) }
			<BlockFooter
				next={ next }
				isSubmitBtnVisible={ isSubmitBtnVisible }
				isErrMsgVisible={ isErrMsgVisible }
				showErrorMessage={ showErrorMessage }
				shakingErr={ shakingErr }
			/>
		</div>
	);
};
export default BlockOutput;
