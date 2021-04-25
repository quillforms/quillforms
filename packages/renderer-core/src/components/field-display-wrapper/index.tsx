/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useFieldRenderContext } from '../field-render';
import useBlockTypes from '../../hooks/use-block-types';
import BlockFooter from '../field-footer';

interface Props {
	setIsShaking: ( value: boolean ) => void;
	isShaking: boolean;
}
let timer1: ReturnType< typeof setTimeout >,
	timer2: ReturnType< typeof setTimeout >;

const FieldDisplayWrapper: React.FC< Props > = ( {
	isShaking,
	setIsShaking,
} ) => {
	const {
		id,
		isFocused,
		next,
		blockName,
		isActive,
		attributes,
		showSubmitBtn,
		showErrMsg,
	} = useFieldRenderContext();

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
		setIsShaking( false );
		if ( shakingErr ) setShakingErr( null );
	}, [ answerValue ] );

	const shakeWithError = ( err ) => {
		clearTimeout( timer1 );
		clearTimeout( timer2 );
		if ( ! isShaking ) setIsShaking( true );
		if ( ! shakingErr ) setShakingErr( err );
		timer1 = setTimeout( () => {
			setIsShaking( false );
		}, 600 );
		timer2 = setTimeout( () => {
			setShakingErr( null );
		}, 1200 );
	};

	const {
		setIsFieldValid,
		setFieldValidationErrr,
		setIsFieldAnswered,
		setFieldAnswer,
	} = useDispatch( 'quillForms/renderer-core' );

	const props = {
		id,
		next,
		attributes,
		isFocused,
		isActive,
		isValid,
		val: answerValue,
		setIsValid: ( val: boolean ) => setIsFieldValid( id, val ),
		setIsAnswered: ( val: boolean ) => setIsFieldAnswered( id, val ),
		setValidationErr: ( val: string ) => setFieldValidationErrr( id, val ),
		setVal: ( val: string ) => setFieldAnswer( id, val ),
		showSubmitBtn,
		blockWithError: ( err: string ) => shakeWithError( err ),
		showErrMsg,
	};

	return (
		<div role="presentation" className="renderer-components-block-output">
			{ blockType?.output && <blockType.output { ...props } /> }
			<BlockFooter shakingErr={ shakingErr } />
		</div>
	);
};
export default FieldDisplayWrapper;
