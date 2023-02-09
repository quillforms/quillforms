/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect } from 'react';
import { forEach, size } from 'lodash';
/**
 * Internal Dependencies
 */
import FieldAction from '../field-action';
import { __experimentalUseFieldRenderContext } from '../field-render';
import SubmitBtn from '../submit-btn';

const ParentBlockFooter = () => {
	const { id, next, isLastField, showErrMsg, isErrMsgVisible } =
		__experimentalUseFieldRenderContext();

	const { isValid, isReviewing } = useSelect( ( select ) => {
		return {
			isValid: select( 'quillForms/renderer-core' ).hasValidFields( id ),
			isReviewing: select( 'quillForms/renderer-core' ).isReviewing(),
		};
	} );

	useEffect( () => {
		if ( isValid ) {
			showErrMsg( false );
		}
		if ( ! isValid && isReviewing ) {
			showErrMsg( true );
		}
	}, [ isReviewing, isValid ] );
	return (
		<div className="renderer-components-block-footer">
			{ isLastField ? (
				<SubmitBtn />
			) : (
				<>
					{ ! isErrMsgVisible && (
						<FieldAction
							show={ true }
							clickHandler={ () => {
								if ( ! isValid ) {
									showErrMsg( true );
								} else {
									next();
								}
							} }
						/>
					) }
				</>
			) }
		</div>
	);
};
export default ParentBlockFooter;
