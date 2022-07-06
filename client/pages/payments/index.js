/**
 * QuillForms Dependencies
 */
import {
	ToggleControl,
	Button,
	BaseControl,
	ControlLabel,
	ControlWrapper,
} from '@quillforms/admin-components';
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';

/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useReducer } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import './style.scss';
import reducer from './state/reducer';
import actions from './state/actions';
import Icon from './icon';
import General from './general';
import Models from './models';
import Products from './products';
import { getInitialState } from './utils';
import { PaymentsContextProvider } from './state/context';

const PaymentsPage = ( { params } ) => {
	const formId = params.id;

	// constants.
	const gateways = getPaymentGatewayModules();

	// component state.
	const [ state, dispatch ] = useReducer( reducer, getInitialState() );
	const { general, models, products, errors } = state;
	const $actions = actions( dispatch );

	// data selectors.
	const { blocks, blocksResolved, blockTypes } = useSelect( ( select ) => {
		return {
			blocks: select( 'quillForms/block-editor' ).getBlocks() ?? [],
			blocksResolved: select(
				'quillForms/block-editor'
			).hasFinishedResolution( 'getBlocks' ),
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes() ?? {},
		};
	} );

	// notice dispatchers.
	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);

	// validate on mount.
	useEffect( () => {
		if ( blocksResolved ) {
			validate();
		}
	}, [ blocksResolved ] );

	const onSave = () => {
		// validate selection of one method at least.
		if ( Object.keys( general.methods ).length === 0 ) {
			createErrorNotice( `⛔ Please select at least one payment method`, {
				type: 'snackbar',
				isDismissible: true,
			} );
			return;
		}

		// validate gateways options.
		const enabled = [];
		for ( const key of Object.keys( general.methods ) ) {
			const gateway = key.split( ':' )[ 0 ];
			if ( ! enabled.includes( gateway ) ) {
				enabled.push( gateway );
			}
		}
		for ( const gateway of enabled ) {
			const options = gateways[ gateway ].options ?? null;
			if ( options && options.has( state ) ) {
				const validate = options.validate( state );
				if ( ! validate.valid ) {
					createErrorNotice( `⛔ ${ validate.message }`, {
						type: 'snackbar',
						isDismissible: true,
					} );
					return;
				}
			}
		}

		// validate adding of one product at least.
		if ( Object.entries( products ).length === 0 ) {
			createErrorNotice( `⛔ Please add at least one product`, {
				type: 'snackbar',
				isDismissible: true,
			} );
			return;
		}

		if ( ! validate() ) {
			createErrorNotice( `⛔ Please check highlighted errors`, {
				type: 'snackbar',
				isDismissible: true,
			} );
			return;
		}

		// save
		apiFetch( {
			path:
				`/wp/v2/quill_forms/${ formId }` +
				`?context=edit&_timestamp=${ Date.now() }`,
			method: 'POST',
			data: {
				payments: {
					general,
					models,
				},
				products,
			},
		} )
			.then( () => {
				createSuccessNotice( '🚀 Saved successfully!', {
					type: 'snackbar',
					isDismissible: true,
				} );
			} )
			.catch( ( error ) => {
				createErrorNotice(
					`⛔ ${ error?.message ?? 'Error while saving!' }`,
					{
						type: 'snackbar',
						isDismissible: true,
					}
				);
			} );
	};

	const validate = () => {
		const $errors = {
			products: {},
		};

		// validate each product
		for ( const [ id, product ] of Object.entries( products ) ) {
			// source
			if ( ! product.source ) {
				$errors.products[ id ] = 'Please select product source';
				continue;
			}

			switch ( product.source.type ) {
				case 'field':
					const block = blocks.find(
						( block ) => block.id === product.source.value
					);
					const blockType = blockTypes[ block?.name ];
					if ( ! block || ! blockType ) {
						$errors.products[ id ] =
							'Unknown form block, please select another source';
						break;
					}

					if ( blockType.supports.numeric ) {
						if ( ! product.name ) {
							$errors.products[ id ] =
								'Please enter product name';
						}
					}
					break;
				case 'variable':
					if ( ! product.name ) {
						$errors.products[ id ] = 'Please enter product name';
					}
					break;
				case 'other':
					if ( product.source.value === 'defined' ) {
						if ( ! product.name ) {
							$errors.products[ id ] =
								'Please enter product name';
						} else if ( ! product.price ) {
							$errors.products[ id ] =
								'Please enter product price';
						}
					} else {
						$errors.products[ id ] = 'Unknown product source';
					}
					break;
				default:
					$errors.products[ id ] = 'Unknown product source';
			}
		}

		$actions.setErrors( $errors );

		return Object.entries( $errors.products ).length === 0;
	};

	return (
		<PaymentsContextProvider
			value={ { state, general, models, products, errors, ...$actions } }
		>
			<div className="quillforms-payments-page">
				<div className="quillforms-payments-page-header">
					<Icon />
					<div className="quillforms-payments-page-heading">
						<p>Accept payments via your forms easily!</p>
						<p>
							Create orders, accept donations or get any type of
							payments with the most versatile form builder that
							integrates with your favorite payment gateways!
						</p>
					</div>
				</div>
				<div className="quillforms-payments-page-settings">
					<General />

					<Models />

					<Products />

					<Button
						className="quillforms-payments-page-settings-save"
						isPrimary
						isLarge
						onClick={ onSave }
					>
						Save
					</Button>
				</div>
			</div>
		</PaymentsContextProvider>
	);
};

export default PaymentsPage;
