/**
 * QuillForms Dependencies
 */
import {
	ToggleControl,
	SelectControl,
	TextControl,
	Button,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { plus, minus } from '@wordpress/icons';
import { Icon } from '@wordpress/components';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import './style.scss';
import { ProductContextProvider } from './context';
import SingleProduct from './single-product';
import MappingProduct from './mapping-product';
import AddRemoveButtons from './add-remove-buttons';

/*
product: {
	type: 'single';
	name: string;
	value_type: 'specific' | 'field' | 'variable';
	value: number | string;
} | {
	type: 'mapping';
	field: string;
	values: {
		'dehbsgz': number;
	}
}
*/

const Product = ( params ) => {
	const { data, onUpdate } = params;
	const { type } = data;

	const typeOptions = [
		{ key: '', name: 'Select type' },
		{ key: 'single', name: 'Single' },
		{ key: 'mapping', name: 'Mapping' },
	];

	const typeSelectControl = (
		<SelectControl
			options={ typeOptions }
			value={
				typeOptions.find( ( option ) => option.key === type ) ??
				typeOptions[ 0 ]
			}
			onChange={ ( selectedChoice ) => {
				const type = selectedChoice.selectedItem.key;
				const product = {
					type,
				};
				if ( type === 'single' ) {
					product.value_type = 'specific';
				}
				onUpdate( product );
			} }
		/>
	);

	return (
		<div className="quillforms-payments-page-settings-product">
			<ProductContextProvider value={ { ...params, typeSelectControl } }>
				{ type === 'single' ? (
					<SingleProduct />
				) : type === 'mapping' ? (
					<MappingProduct />
				) : (
					<div className="quillforms-payments-page-settings-product-unspecified">
						{ typeSelectControl }
						<AddRemoveButtons />
					</div>
				) }
			</ProductContextProvider>
			{ params.error && (
				<div className="quillforms-payments-page-settings-product-error">
					{ params.error }
				</div>
			) }
		</div>
	);
};

export default Product;
