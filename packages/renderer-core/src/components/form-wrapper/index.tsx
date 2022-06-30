/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { cloneDeep, map, omit, size } from 'lodash';

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
	const [ isMounted, setIsMounted ] = useState( false );
	const editableFields = useEditableFields();
	const blocks = useBlocks();
	const { insertEmptyFieldAnswer, goToBlock } = useDispatch(
		'quillForms/renderer-core'
	);
	const { isPreview } = useFormContext();
	const { setSwiper } = useDispatch( 'quillForms/renderer-core' );
	useEffect( () => {
		if ( ! isPreview ) {
			editableFields.forEach( ( field ) =>
				insertEmptyFieldAnswer( field.id, field.name )
			);
			const welcomeScreens = map(
				cloneDeep( blocks ).filter(
					( block ) => block.name === 'welcome-screen'
				),
				( block ) => omit( block, [ 'name' ] )
			) as [  ] | Screen[];

			const thankyouScreens = map(
				cloneDeep( blocks ).filter(
					( block ) => block.name === 'thankyou-screen'
				),
				( block ) => omit( block, [ 'name' ] )
			) as [  ] | Screen[];
			setSwiper( {
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
			} );

			setIsMounted( true );
		}
	}, [ JSON.stringify( blocks ) ] );

	useEffect( () => {
		if ( isMounted ) {
			const firstBlock = blocks && blocks[ 0 ] ? blocks[ 0 ] : undefined;

			setTimeout( () => {
				if ( firstBlock?.id ) {
					goToBlock( firstBlock.id );
				}
			}, 100 );
		}
	}, [ isMounted ] );

	return <FormFlow applyLogic={ applyLogic } />;
};

export default FormWrapper;
