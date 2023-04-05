/**
 * WordPress Dependencies
 */
import { useEffect, useState } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { doAction } from '@wordpress/hooks';

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
	const editableFields = useEditableFields( true );
	const { currentBlockId, blockTypes } = useSelect( ( select ) => {
		return {
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );
	const blocks = useBlocks();
	const {
		isPreview,
		formObj: { hiddenFields },
	} = useFormContext();
	const {
		setSwiper,
		insertEmptyFieldAnswer,
		goToBlock,
		setPaymentData,
		setFieldAnswer,
	} = useDispatch( 'quillForms/renderer-core' );

	const replaceHiddenFields = ( val ) => {
		const newVal = val.replace(
			/{{hidden_field:([a-zA-Z0-9-_]+)}}/g,
			( _match, p1 ) => {
				if ( size( hiddenFields ) > 0 && hiddenFields?.[ p1 ] ) {
					return hiddenFields[ p1 ];
				}
				return '';
			}
		);

		return newVal;
	};
	useEffect( () => {
		if ( ! isPreview ) {
			editableFields.forEach( ( field ) => {
				if ( field?.attributes?.defaultValue ) {
					const blockType = blockTypes[ field.name ];
					if ( blockType?.supports?.numeric ) {
						setFieldAnswer(
							field.id,
							// @ts-expect-error
							blockType?.getNumericVal(
								replaceHiddenFields(
									field.attributes.defaultValue
								)
							)
						);
					} else {
						setFieldAnswer(
							field.id,
							replaceHiddenFields( field.attributes.defaultValue )
						);
					}
				} else {
					insertEmptyFieldAnswer( field.id, field.name );
				}
			} );
			const welcomeScreens = map(
				cloneDeep( blocks ).filter(
					( block ) => block.name === 'welcome-screen'
				),
				( block ) => omit( block, [ 'name' ] )
			) as [] | Screen[];

			const thankyouScreens = map(
				cloneDeep( blocks ).filter(
					( block ) => block.name === 'thankyou-screen'
				),
				( block ) => omit( block, [ 'name' ] )
			) as [] | Screen[];
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
			if ( ! applyLogic && ! isPreview ) {
				if ( currentBlockId ) goToBlock( currentBlockId, true );
			}
			setIsMounted( true );
		}
	}, [ JSON.stringify( blocks ) ] );

	useEffect( () => {
		if ( isMounted ) {
			const firstBlock = blocks && blocks[ 0 ] ? blocks[ 0 ] : undefined;

			const urlParams = new URLSearchParams( window.location.search );
			const isPaymentStep = urlParams.get( 'step' ) === 'payment';

			let formCompleted = false;
			if ( isPaymentStep ) {
				doAction(
					'QuillForms.RendererCore.PaymentStep',
					urlParams,
					() => {
						formCompleted = true;
						goToBlock(
							// @ts-expect-error
							window?.pending_submission?.thankyou_screen_id ??
								urlParams.get( 'thankyou_screen_id' ) ??
								'default_thankyou_screen'
						);
					},
					() => {
						// @ts-expect-error.
						setPaymentData( window?.pending_submission );
					}
				);
			}

			if ( ! formCompleted ) {
				setTimeout( () => {
					if ( firstBlock?.id ) {
						goToBlock( firstBlock.id );
					}
				}, 100 );
			}
		}
	}, [ isMounted ] );

	return <FormFlow applyLogic={ applyLogic } />;
};

export default FormWrapper;
