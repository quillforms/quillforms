/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import Button from '../button';
import useFormContext from '../../hooks/use-form-context';
import { useFieldRenderContext } from '../field-render';
const SubmitBtn: React.FC = () => {
	const { isLastField, isActive } = useFieldRenderContext();
	const { goToField, setSwiper } = useDispatch( 'quillForms/renderer-core' );

	const { firstInvalidFieldId } = useSelect( ( select ) => {
		return {
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
		setSwiper( {
			isReviewing: false,
		} );
		if ( firstInvalidFieldId ) {
			setTimeout( () => {
				setSwiper( {
					isReviewing: true,
				} );
			}, 50 );

			setTimeout( () => {
				goToFirstInvalidField();
			}, 100 );
		} else {
			onSubmit();
		}
	};

	const { onSubmit } = useFormContext();
	return (
		<Button
			className="renderer-core-submit-btn"
			onClick={ () => {
				submitHandler();
			} }
			onKeyDown={ ( e ) => {
				if ( e.key === 'Enter' ) {
					e.stopPropagation();
					submitHandler();
				}
			} }
		>
			Submit
		</Button>
		// { /* <Loader
		// 		type="TailSpin"
		// 		color="#fff"
		// 		height={ 30 }
		// 		width={ 30 }
		// 	/> */ }
	);
};
export default SubmitBtn;
