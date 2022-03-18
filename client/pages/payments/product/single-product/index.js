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
import { plus } from '@wordpress/icons';
import { Icon } from '@wordpress/components';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import './style.scss';
import { useProductContext } from '../context';
import AddRemoveButtons from '../add-remove-buttons';
import FieldSelect from '../../field-select';

const SingleProduct = () => {
	const { data, onUpdate, typeSelectControl } = useProductContext();
	const { name, value_type, value } = data;

	const value_typeOption = [
		{ key: 'specific', name: 'Specific' },
		{ key: 'field', name: 'Numeric Field' },
		{ key: 'variable', name: 'Calculation' },
	];

	return (
		<div className="quillforms-payments-page-settings-product-single">
			{ typeSelectControl }
			<TextControl
				className="quillforms-payments-page-settings-product-single-name ml-2"
				placeholder="Product name"
				value={ name ?? '' }
				onChange={ ( value ) => {
					onUpdate( {
						...data,
						name: value,
					} );
				} }
			/>
			<SelectControl
				className="ml-2"
				options={ value_typeOption }
				value={ value_typeOption.find(
					( option ) => option.key === value_type
				) }
				onChange={ ( selectedChoice ) => {
					onUpdate( {
						...data,
						value_type: selectedChoice.selectedItem.key,
						value: undefined,
					} );
				} }
			/>
			{ value_type === 'specific' ? (
				<TextControl
					className="quillforms-payments-page-settings-product-single-price ml-2"
					placeholder="Price"
					type="number"
					value={ value ?? '' }
					onChange={ ( value ) => {
						onUpdate( {
							...data,
							value,
						} );
					} }
				/>
			) : value_type === 'field' ? (
				<FieldSelect
					className="ml-2"
					blockNames={ [ 'number' ] }
					value={ value }
					onChange={ ( value ) => {
						onUpdate( {
							...data,
							value,
						} );
					} }
				/>
			) : (
				<FieldSelect
					className="ml-2"
					blockNames={ [] }
					includeVariables={ true }
					value={ value }
					onChange={ ( value ) => {
						onUpdate( {
							...data,
							value,
						} );
					} }
				/>
			) }
			<AddRemoveButtons />
		</div>
	);
};

export default SingleProduct;
