/**
 * WordPress dependencies
 */
import { useState, useEffect, memo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
/**
 * Internal dependencies
 */
import {
	FieldRenderContextProvider,
	__experimentalUseFieldRenderContext,
} from './context';
import FieldWrapper from '../field-wrapper';

export { __experimentalUseFieldRenderContext };

interface Props {
	id: string;
	isActive: boolean;
	shouldBeRendered: boolean;
	isLastField: boolean;
}

const FieldRender: React.FC< Props > = memo(
	( { id, isActive, isLastField, shouldBeRendered } ) => {
		const [ isSubmitBtnVisible, showNextBtn ] = useState< boolean >(
			false
		);
		const [ isErrMsgVisible, showErrMsg ] = useState< boolean >( false );

		const {
			isReviewing,
			isValid,
			block,
			firstInvalidFieldId,
			lastFieldId,
		} = useSelect( ( select ) => {
			const walkPath = select( 'quillForms/renderer-core' ).getWalkPath();
			return {
				isReviewing: select( 'quillForms/renderer-core' ).isReviewing(),
				isValid: select( 'quillForms/renderer-core' ).isValidField(
					id
				),
				block: select( 'quillForms/renderer-core' ).getBlockById( id ),
				firstInvalidFieldId: select(
					'quillForms/renderer-core'
				).getFirstInvalidFieldId(),
				lastFieldId: walkPath[ walkPath.length - 1 ].id,
			};
		} );

		useEffect( () => {
			if ( isReviewing && ! isValid ) {
				showErrMsg( true );
			}
		}, [ isReviewing ] );

		const { goNext, goToBlock } = useDispatch( 'quillForms/renderer-core' );
		if ( ! block ) return null;
		const { name, attributes } = block;

		const context = {
			id,
			blockName: name,
			attributes,
			isActive,
			shouldBeRendered,
			isErrMsgVisible,
			showErrMsg,
			isSubmitBtnVisible,
			showNextBtn,
			next: () => {
				if ( ! isReviewing ) {
					goNext();
				} else {
					if ( firstInvalidFieldId ) {
						goToBlock( firstInvalidFieldId );
					} else {
						goToBlock( lastFieldId );
					}
				}
			},
			isLastField,
		};
		return (
			<FieldRenderContextProvider value={ context }>
				<FieldWrapper />
			</FieldRenderContextProvider>
		);
	}
);

export default FieldRender;
