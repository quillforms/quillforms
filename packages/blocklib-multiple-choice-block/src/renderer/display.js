/**
 * QuillForms Depndencies
 */
import { useMessages } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useEffect, useState } from 'react';

/**
 * Internal Dependencies
 */
import ChoicesWrapper from './choices-wrapper';

let multipleChoiceTimer;
const MultipleChoiceOutput = ( props ) => {
	const {
		id,
		attributes,
		setIsValid,
		setIsAnswered,
		showNextBtn,
		setValidationErr,
		val,
		setVal,
		next,
		isActive,
		isAnimating,
		showErrMsg,
		isPreview,
		isReviewing,
	} = props;
	const { multiple, required } = attributes;
	const messages = useMessages();
	const [ choiceClicked, setChoiceClicked ] = useState( null );
	const checkfieldValidation = () => {
		if ( required === true && ( ! val || val.length === 0 ) ) {
			setIsValid( false );
			setValidationErr( messages[ 'label.errorAlert.required' ] );
		} else {
			setIsValid( true );
			setValidationErr( null );
		}
	};

	useEffect( () => {
		return () => clearTimeout( multipleChoiceTimer );
	}, [] );

	useEffect( () => {
		if ( ! isActive ) {
			clearTimeout( multipleChoiceTimer );
		}
		if ( ! isActive && ! isAnimating ) {
			setChoiceClicked( null );
		}
	}, [ isActive, isAnimating ] );

	useEffect( () => {
		clearTimeout( multipleChoiceTimer );
		if ( choiceClicked && val?.length > 0 && ! multiple ) {
			multipleChoiceTimer = setTimeout( () => {
				next();
			}, 600 );
		}
	}, [ choiceClicked ] );

	useEffect( () => {
		if ( isPreview || ! isReviewing ) checkfieldValidation( val );
	}, [ attributes ] );

	useEffect( () => {
		if ( val?.length > 0 ) {
			setIsAnswered( true );
		} else {
			setIsAnswered( false );
		}
		if ( multiple ) {
			if ( val?.length > 0 ) {
				showNextBtn( true );
			}
		}
	}, [ val, attributes ] );

	return (
		<div className="qf-multiple-choice-block-renderer">
			<ChoicesWrapper
				attributes={ attributes }
				id={ id }
				val={ val }
				checkfieldValidation={ checkfieldValidation }
				setVal={ setVal }
				setChoiceClicked={ ( val ) => {
					showErrMsg( false );
					setChoiceClicked( val );
				} }
			/>
		</div>
	);
};
export default MultipleChoiceOutput;
