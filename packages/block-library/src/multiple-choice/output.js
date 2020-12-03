/**
 * WordPress Dependencies
 */
import { useMetaField } from '@quillforms/renderer-components';
import { useEffect } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import ChoiceItem from './choice-item';
import ChoicesWrapper from './choices-wrapper';

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
	} = props;
	const { multiple } = attributes;
	const messages = useMetaField( 'messages' );

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
		}
	}, [ val ] );

	return (
		<div className="question__wrapper">
			<ChoicesWrapper
				attributes={ attributes }
				next={ next }
				id={ id }
				val={ val }
				setVal={ setVal }
			/>
		</div>
	);
};
export default MultipleChoiceOutput;
