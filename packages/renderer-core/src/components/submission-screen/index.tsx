/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
/**
 * Internal Dependencies
 */
import Button from '../button';

import classnames from 'classnames';
import useFormContext from '../../hooks/use-form-context';
const SubmissionScreen = ( { active } ) => {
	const { goToField } = useDispatch( 'quillForms/renderer-core' );
	const { firstInvalidFieldId } = useSelect( ( select ) => {
		return {
			firstInvalidFieldId: select(
				'quillForms/renderer-submission'
			).getFirstInvalidFieldId(),
		};
	} );

	const { onSubmit } = useFormContext();
	return (
		<div
			className={ classnames( 'submission__screen', {
				active: active === true,
				inactive: active === false,
			} ) }
		>
			<div className="submission__btnWrapper">
				<Button
					className="submission__btn"
					onClick={ () => {
						if ( firstInvalidFieldId ) {
							goToField( firstInvalidFieldId );
						} else {
							onSubmit();
						}
					} }
				>
					Submit
				</Button>
				{ /* <Loader
					type="TailSpin"
					color="#fff"
					height={ 30 }
					width={ 30 }
				/> */ }
			</div>
		</div>
	);
};
export default SubmissionScreen;
