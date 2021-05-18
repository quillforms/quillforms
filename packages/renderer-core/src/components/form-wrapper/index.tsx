/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { cloneDeep, omit, size } from 'lodash';

/**
 * Internal Dependencies
 */
import useEditableFields from '../../hooks/use-editable-fields';
import FormFlow from '../form-flow';
import useBlocks from '../../hooks/use-blocks';
import type { Screen } from '../../store/types';
import useFormContext from '../../hooks/use-form-context';
interface Props {
	applyLogic: boolean;
}
const FormWrapper: React.FC< Props > = ( { applyLogic } ) => {
	const editableFields = useEditableFields();
	const blocks = useBlocks();
	console.log( blocks );
	const { insertEmptyFieldAnswer } = useDispatch(
		'quillForms/renderer-core'
	);
	const { isPreview } = useFormContext();
	const { setSwiper } = useDispatch( 'quillForms/renderer-core' );
	useEffect( () => {
		if ( ! isPreview ) {
			editableFields.forEach( ( field ) =>
				insertEmptyFieldAnswer( field.id, field.name )
			);
			const firstBlock = blocks && blocks[ 0 ] ? blocks[ 0 ] : undefined;
			console.log( firstBlock );
			const welcomeScreens = omit(
				cloneDeep( blocks ).filter(
					( block ) => block.name === 'welcome-screen'
				),
				[ 'name' ]
			) as {} | Screen[];

			const thankyouScreens = omit(
				cloneDeep( blocks ).filter(
					( block ) => block.name === 'thankyou-screen'
				)[ 'name' ]
			) as {} | Screen[];
			setSwiper( {
				isAnimating: true,
				walkPath: cloneDeep(
					blocks.filter(
						( block ) =>
							block.name !== 'thankyou-screen' &&
							block.name !== 'welcome-screen'
					)
				),
				welcomeScreens:
					size( welcomeScreens ) === 0
						? []
						: ( welcomeScreens as Screen[] ),
				thankyouScreens:
					size( thankyouScreens ) === 0
						? []
						: ( thankyouScreens as Screen[] ),
				canGoPrev: false,
				canGoNext: true,
				prevBlockId: undefined,
				nextBlockId: blocks && blocks[ 1 ] ? blocks[ 1 ].id : undefined,
			} );

			setTimeout( () => {
				setSwiper( {
					currentBlockId: firstBlock?.id,
				} );
			}, 100 );
		}
	}, [] );

	return <FormFlow applyLogic={ applyLogic } />;
};

export default FormWrapper;
