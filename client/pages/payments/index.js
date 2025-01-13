/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
import { getPaymentGatewayModules } from '@quillforms/payment-gateways';

/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useReducer, useState } from '@wordpress/element';
import { Modal } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { AnimateSharedLayout } from 'framer-motion';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import './style.scss';
import reducer from './state/reducer';
import actions from './state/actions';
import Icon from './icon';
import General from './general';
import Methods from './general/methods';
import GatewaysOptions from './general/gateways-options';
import Models from './models';
import Products from './products';
import Labels from './labels';
import { getInitialState } from './utils';
import { PaymentsContextProvider } from './state/context';
import { forEach, size } from 'lodash';
import Coupons from './coupons';

const PaymentsPage = ({ params }) => {
	const [showReleaseModal, setShowReleaseModal] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			localStorage.setItem('qf_payments_modal_viewed', true);
		}, 100);
	}, [showReleaseModal]);

	useEffect(() => {
		setShowReleaseModal(true);
	}, []);
	const formId = params.id;

	// constants.
	const gateways = getPaymentGatewayModules();

	// component state.
	const [state, dispatch] = useReducer(reducer, getInitialState());
	const { general, models, products, labels, coupons, errors } = state;
	const settings = {
		...general,
		models,
		labels,
	};
	const $actions = actions(dispatch);

	// data selectors.
	const { formBlocks, blocksResolved, blockTypes } = useSelect(
		(select) => {
			return {
				formBlocks:
					select('quillForms/block-editor').getBlocks() ?? [],
				blocksResolved: select(
					'quillForms/block-editor'
				).hasFinishedResolution('getBlocks'),
				blockTypes: select('quillForms/blocks').getBlockTypes() ?? {},
			};
		}
	);

	const blocks = [];

	if (size(formBlocks) > 0) {
		forEach(formBlocks, (block) => {
			const blockType = blockTypes[block.name];
			if (blockType) {
				blocks.push(block);
				if (
					blockType?.supports?.innerBlocks &&
					size(block?.innerBlocks) > 0
				) {
					forEach(block.innerBlocks, (childBlock) => {
						blocks.push(childBlock);
					});
				}
			}
		});
	}

	// notice dispatchers.
	const { createErrorNotice, createSuccessNotice } =
		useDispatch('core/notices');

	// validate on mount.
	useEffect(() => {
		if (blocksResolved) {
			validate();
		}
	}, [blocksResolved]);

	const onSave = () => {
		// validate selection of one method at least.
		if (general.enabled && Object.keys(general.methods).length === 0) {
			createErrorNotice(__('⛔ Please select at least one payment method', 'quillforms'), {
				type: 'snackbar',
				isDismissible: true,
			});
			return;
		}

		// validate gateways options.
		const enabled = [];
		for (const key of Object.keys(general.methods)) {
			const gateway = key.split(':')[0];
			if (!enabled.includes(gateway)) {
				enabled.push(gateway);
			}
		}
		for (const gateway of enabled) {
			const options = gateways[gateway].options ?? null;
			if (options && options.has(settings)) {
				const validate = options.validate(settings);
				if (!validate.valid) {
					createErrorNotice(__('⛔ ', 'quillforms') + validate.message, {
						type: 'snackbar',
						isDismissible: true,
					});
					return;
				}
			}
		}

		// validate adding of one product at least.
		if (general.enabled && Object.entries(products).length === 0) {
			createErrorNotice(__('⛔ Please add at least one product', 'quillforms'), {
				type: 'snackbar',
				isDismissible: true,
			});
			return;
		}

		if (!validate()) {
			createErrorNotice(__('⛔ Please check highlighted errors', 'quillforms'), {
				type: 'snackbar',
				isDismissible: true,
			});
			return;
		}
		// save
		apiFetch({
			path:
				`/wp/v2/quill_forms/${formId}` +
				`?context=edit&_timestamp=${Date.now()}`,
			method: 'POST',
			data: {
				payments: {
					...general,
					models,
					labels,
					coupons,
				},
				products,
			},
		})
			.then(() => {
				createSuccessNotice(__('🚀 Saved successfully!', 'quillforms'), {
					type: 'snackbar',
					isDismissible: true,
				});
			})
			.catch((error) => {
				createErrorNotice(
					`⛔ ${error?.message ?? __('Error while saving!', 'quillforms')}`,
					{
						type: 'snackbar',
						isDismissible: true,
					}
				);
			});
	};

	const validate = () => {
		const $errors = {
			products: {},
		};

		// validate each product
		for (const [id, product] of Object.entries(products)) {
			// source
			if (!product.source) {
				$errors.products[id] = __('Please select product source', 'quillforms');
				continue;
			}

			switch (product.source.type) {
				case 'field':
					const block = blocks.find(
						(block) => block.id === product.source.value
					);
					const blockType = blockTypes[block?.name];
					if (!block || !blockType) {
						$errors.products[id] =
							__('Unknown form block, please select another source', 'quillforms');
						break;
					}

					if (blockType.supports.numeric) {
						if (!product.name) {
							$errors.products[id] =
								__('Please enter product name', 'quillforms');
						}
					}
					break;
				case 'variable':
					if (!product.name) {
						$errors.products[id] = __('Please enter product name', 'quillforms');
					}
					break;
				case 'other':
					if (product.source.value === 'defined') {
						if (!product.name) {
							$errors.products[id] =
								__('Please enter product name', 'quillforms');
						} else if (!product.price) {
							$errors.products[id] =
								__('Please enter product price', 'quillforms');
						}
					} else {
						$errors.products[id] = __('Unknown product source', 'quillforms');
					}
					break;
				default:
					$errors.products[id] = __('Unknown product source', 'quillforms');
			}
		}

		$actions.setErrors($errors);

		return Object.entries($errors.products).length === 0;
	};

	return (
		<AnimateSharedLayout>
			<PaymentsContextProvider
				value={{
					settings,
					general,
					models,
					products,
					labels,
					coupons,
					errors,
					...$actions,
				}}
			>
				<div className="quillforms-payments-page">
					<div className="quillforms-payments-page-header">
						<Icon />
						<div className="quillforms-payments-page-heading">
							<p>{__('Accept payments via your forms easily!', 'quillforms')}</p>
							<p>
								{__('Create orders, accept donations or get any type of payments with the most versatile form builder that integrates with your favorite payment gateways!', 'quillforms')}
							</p>
						</div>
					</div>
					<div className="quillforms-payments-page-settings">
						<General />
						<Products />
						<Coupons />
						<Models />

						<Methods />
						<GatewaysOptions />
						<Labels />

						<Button
							className="quillforms-payments-page-settings-save"
							isPrimary
							isLarge
							onClick={onSave}
						>
							Save
						</Button>
					</div>
				</div>
			</PaymentsContextProvider>
			{showReleaseModal &&
				!localStorage.getItem('qf_payments_modal_viewed') && (
					<Modal
						focusOnMount={true}
						shouldCloseOnEsc={false}
						shouldCloseOnClickOutside={false}
						className={css`
							border: none !important;
							border-radius: 9px;

							.components-modal__header {
								background: linear-gradient(
									42deg,
									rgb( 235 54 221 ),
									rgb( 238 142 22 )
								);
								h1 {
									color: #fff;
								}
								svg {
									fill: #fff;
								}
							}
							.components-modal__content {
								text-align: center;
							}
						` }
						title={__('How to accept payments with Quill Forms?', 'quillforms')}
						onRequestClose={() => {
							setShowReleaseModal(false);
						}}
					>
						<iframe
							width="560"
							height="315"
							src="https://www.youtube.com/embed/r2Qu3ElzYoI"
							title="How to accept payments with Quill Forms?"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						></iframe>
					</Modal>
				)}
		</AnimateSharedLayout>
	);
};

export default PaymentsPage;
