/**
 * QuillForms Depndencies
 */
import { useMessages } from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import ChoicesWrapper from './choices-wrapper';

let multipleChoiceTimer;
const MultipleChoiceOutput = ( props ) => {
	const {
		id,
		attributes,
		required,
		setIsValid,
		setIsAnswered,
		showSubmitBtn,
		setValidationErr,
		val,
		setVal,
		next,
		isActive,
		isAnimating,
	} = props;
	const { multiple } = attributes;
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
		if ( ! isActive && ! isAnimating ) {
			setChoiceClicked( null );
		}
	}, [ isActive, isAnimating ] );

	useEffect( () => {
		clearTimeout( multipleChoiceTimer );
		if ( choiceClicked && val?.length > 0 && ! multiple ) {
			multipleChoiceTimer = setTimeout( () => {
				next();
			}, 500 );
		}
	}, [ choiceClicked ] );

	useEffect( () => {
		checkfieldValidation( val );
	}, [ attributes ] );

	useEffect( () => {
		checkfieldValidation( val );
		if ( val?.length > 0 ) {
			setIsAnswered( true );
		} else {
			setIsAnswered( false );
		}
		if ( multiple ) {
			if ( val?.length > 0 ) {
				showSubmitBtn( true );
			} else {
				showSubmitBtn( false );
			}
		} else {
			showSubmitBtn( false );
		}
	}, [ val, attributes ] );

	return (
		<div className="question__wrapper">
			<ChoicesWrapper
				attributes={ attributes }
				id={ id }
				val={ val }
				setVal={ setVal }
				setChoiceClicked={ setChoiceClicked }
			/>
		</div>
	);
};
export default MultipleChoiceOutput;
