/**
 * WordPress dependencies
 */
import { useState, useEffect, memo } from 'react';
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
	isCurrentBlockSafeToSwipe: boolean;
	next: Function;
}

const FieldRender: React.FC< Props > = memo(
	( {
		id,
		isActive,
		isLastField,
		shouldBeRendered,
		isCurrentBlockSafeToSwipe,
		next,
	} ) => {
		const [ isSubmitBtnVisible, showNextBtn ] = useState< boolean >( true );
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

		const { goToBlock, setIsCurrentBlockSafeToSwipe } = useDispatch(
			'quillForms/renderer-core'
		);

		useEffect( () => {
			if ( isActive && ! isReviewing && ! isErrMsgVisible ) {
				showErrMsg( false );
				setIsCurrentBlockSafeToSwipe( true );
			}
		}, [ isActive, isErrMsgVisible, isReviewing ] );

		useEffect( () => {
			if ( ! isCurrentBlockSafeToSwipe ) {
				showErrMsg( true );
			}
		}, [ isCurrentBlockSafeToSwipe ] );
		useEffect( () => {
			if ( isReviewing && ! isValid ) {
				showErrMsg( true );
			}
		}, [ isReviewing, isValid ] );

		if ( ! block ) return null;
		//console.log( block );
		const { name, attributes, innerBlocks } = block;

		const context = {
			id,
			blockName: name,
			attributes,
			innerBlocks,
			isActive,
			shouldBeRendered,
			isErrMsgVisible,
			showErrMsg,
			isSubmitBtnVisible,
			showNextBtn,
			next: () => {
				if ( ! isReviewing ) {
					next();
				} else if ( firstInvalidFieldId ) {
					goToBlock( firstInvalidFieldId );
				} else {
					goToBlock( lastFieldId );
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
