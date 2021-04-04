/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { cloneDeep, omit } from 'lodash';

/**
 * Internal Dependencies
 */
import useEditableFields from '../../hooks/use-editable-fields';
import FormFlow from '../form-flow';
import useBlocks from '../../hooks/use-blocks';
import type { Screen } from '../../store/types';
interface Props {
	applyLogic: boolean;
	isPreview: boolean;
}
const FormWrapper: React.FC< Props > = ( { applyLogic, isPreview } ) => {
	const editableFields = useEditableFields();
	const blocks = useBlocks();
	const { insertEmptyFieldAnswer } = useDispatch(
		'quillForms/renderer-core'
	);
	const { setSwiper } = useDispatch( 'quillForms/renderer-core' );
	useEffect( () => {
		if ( ! isPreview ) {
			editableFields.forEach( ( field ) =>
				insertEmptyFieldAnswer( field.id, field.name )
			);
			const firstBlock = blocks && blocks[ 0 ] ? blocks[ 0 ] : undefined;
			setTimeout( () => {
				setSwiper( {
					currentBlockId: firstBlock?.id,
					isAnimating: true,
					walkPath: cloneDeep(
						blocks.filter(
							( block ) =>
								block.name !== 'thankyou-screen' &&
								block.name !== 'welcome-screen'
						)
					),
					welcomeScreens: omit(
						cloneDeep(
							blocks.filter(
								( block ) => block.name === 'welcome-screen'
							)
						),
						[ 'name' ]
					) as Screen[],
					thankyouScreens: omit(
						cloneDeep(
							blocks.filter(
								( block ) => block.name === 'thankyou-screen'
							)
						),
						[ 'name' ]
					) as Screen[],
					isWelcomeScreenActive:
						firstBlock?.name === 'welcome-screen' ? true : false,
					isThankyouScreenActive:
						firstBlock?.name === 'thankyou-screen' ? true : false,
					canGoPrev: false,
					canGoNext: true,
					prevBlockId: undefined,
					nextBlockId:
						blocks && blocks[ 1 ] ? blocks[ 1 ].id : undefined,
				} );
			}, 0 );
		}
	}, [] );

	return <FormFlow applyLogic={ applyLogic } />;
};

export default FormWrapper;
