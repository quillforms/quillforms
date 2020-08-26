/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import FieldAction from '../field-action';
import ErrMsg from '../error-message';

const EditableBlockFooter = ( { id, isReviewing, next } ) => {
	const { showErr, errMsgKey, value } = useSelect( ( select ) => {
		return {
			showErr: select( 'quillForms/renderer-submission' ).getShowErrFlag(
				id
			),
			errMsgKey: select(
				'quillForms/renderer-submission'
			).getErrMsgKeyFlag( id ),
			value: select( 'quillForms/renderer-submission' ).getFieldAnswerVal(
				id
			),
		};
	} );

	const { setShowFieldErr } = useDispatch( 'quillForms/renderer-submission' );
	return (
		<div className="renderer-components-block-footer">
			{ errMsgKey && ( showErr || isReviewing ) ? (
				<ErrMsg key={ errMsgKey } />
			) : (
				<>
					{ value ? (
						<FieldAction
							clickHandler={ () => {
								setShowFieldErr( id, true );
								if ( ! errMsgKey ) {
									next();
								}
							} }
						/>
					) : (
						<Fragment />
					) }
				</>
			) }
		</div>
	);
};
export default EditableBlockFooter;
