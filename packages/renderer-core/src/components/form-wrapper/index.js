/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { cloneDeep } from 'lodash';

/**
 * Internal Dependencies
 */
import useEditableFields from '../../hooks/use-editable-fields';
import FormFlow from '../form-flow';
import useBlocks from '../../hooks/use-blocks';

const FormWrapper = ( { applyLogic, isPreview } ) => {
	const editableFields = useEditableFields();
	const blocks = useBlocks();
	const { insertEmptyFieldAnswer } = useDispatch(
		'quillForms/renderer-submission'
	);
	const { setSwiper } = useDispatch( 'quillForms/renderer-core' );
	useEffect( () => {
		if ( ! isPreview ) {
			editableFields.forEach( ( field ) =>
				insertEmptyFieldAnswer( field.id, field.type )
			);
			const firstBlock = blocks && blocks[ 0 ] ? blocks[ 0 ].id : null;
			setTimeout( () => {
				setSwiper( {
					currentBlockId: firstBlock,
					isAnimating: true,
					walkPath: cloneDeep(
						blocks.filter(
							( block ) =>
								block.name !== 'thankyou-screen' &&
								block.name !== 'welcome-screen'
						)
					),
					welcomeScreens: cloneDeep(
						blocks.filter(
							( block ) => block.name === 'welcome-screen'
						)
					),
					thankyouScreens: cloneDeep(
						blocks.filter(
							( block ) => block.name === 'thankyou-screen'
						)
					),
					isWelcomeScreenActive:
						firstBlock?.type === 'welcome-screen' ? true : false,
					isThankyouScreenActive:
						firstBlock?.type === 'welcome-screen' ? true : false,
					canGoPrev: false,
					canGoNext: true,
					prevBlockId: null,
					nextBlockId: blocks && blocks[ 1 ] ? blocks[ 1 ].id : null,
				} );
			}, 0 );
		}
	}, [] );

	return <FormFlow applyLogic={ applyLogic } />;
};

export default FormWrapper;
