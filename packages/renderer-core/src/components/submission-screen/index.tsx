/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import Loader from 'react-loader-spinner';

/**
 * Internal Dependencies
 */
import Button from '../button';
import useFormContext from '../../hooks/use-form-context';
import { useFieldRenderContext } from '../field-render';

const SubmitBtn: React.FC = () => {
	const { isLastField, isActive } = useFieldRenderContext();
	const { goToField, setIsReviewing, setIsSubmitting } = useDispatch(
		'quillForms/renderer-core'
	);
	const { onSubmit } = useFormContext();

	const { firstInvalidFieldId, isSubmitting } = useSelect( ( select ) => {
		return {
			isSubmitting: select( 'quillForms/renderer-core' ).isSubmitting(),
			firstInvalidFieldId: select(
				'quillForms/renderer-core'
			).getFirstInvalidFieldId(),
		};
	} );

	const handleKeyDown = ( e ) => {
		if ( e.key === 'Enter' ) {
			if ( e.metaKey ) {
				submitHandler();
			}
		}
	};

	const goToFirstInvalidField = () => {
		if ( firstInvalidFieldId ) goToField( firstInvalidFieldId );
	};
	useEffect( () => {
		if ( isLastField && isActive ) {
			window.addEventListener( 'keydown', handleKeyDown );
		} else {
			removeEventListener( 'keydown', handleKeyDown );
		}

		return () => removeEventListener( 'keydown', handleKeyDown );
	}, [ isLastField, isActive ] );

	const submitHandler = () => {
		setIsReviewing( false );
		if ( firstInvalidFieldId ) {
			setTimeout( () => {
				setIsReviewing( true );
			}, 50 );

			setTimeout( () => {
				goToFirstInvalidField();
			}, 100 );
		} else {
			setIsSubmitting( true );
			onSubmit();
		}
	};

	return (
		<Button
			className="renderer-core-submit-btn"
			onClick={ () => {
				if ( ! isSubmitting ) submitHandler();
			} }
			onKeyDown={ ( e ) => {
				if ( e.key === 'Enter' ) {
					e.stopPropagation();
					if ( ! isSubmitting ) submitHandler();
				}
			} }
		>
			Submit
			{ isSubmitting && (
				<Loader
					className="renderer-core-submit-btn__loader"
					type="TailSpin"
					color="#fff"
					height={ 20 }
					width={ 20 }
				/>
			) }
		</Button>
	);
};
export default SubmitBtn;
