/**
 * QuillForms Dependencies
 */
import {
	ToggleControl,
	SelectControl,
	TextControl,
	Button,
} from '@quillforms/admin-components';
import ConfigAPI from '@quillforms/config';

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
import { useProductContext } from '../context';
import AddRemoveButtons from '../add-remove-buttons';
import FieldSelect from '../../field-select';

const SingleProduct = () => {
	const { data, onUpdate, typeSelectControl } = useProductContext();

	const choices = data.field
		? ( ConfigAPI.getInitialPayload().blocks ?? [] ).find( ( block ) => {
				return block.id === data.field;
		  } )?.attributes?.choices
		: null;

	return (
		<div className="quillforms-payments-page-settings-product-mapping">
			<div className="quillforms-payments-page-settings-product-mapping-header">
				{ typeSelectControl }
				<FieldSelect
					className="ml-2"
					blockNames={ [ 'multiple-choice', 'dropdown' ] }
					value={ data.field }
					onChange={ ( value ) => {
						onUpdate( {
							...data,
							field: value,
						} );
					} }
				/>
				<AddRemoveButtons />
			</div>
			<div className="quillforms-payments-page-settings-product-mapping-body">
				{ choices &&
					choices.map( ( choice ) => {
						return (
							<div
								key={ choice.value }
								className="quillforms-payments-page-settings-product-mapping-choice"
							>
								<div>{ choice.label }:</div>
								<TextControl
									className="ml-2"
									placeholder="Price"
									type="number"
									value={ data.values?.[ choice.value ] ?? 0 }
									onChange={ ( value ) => {
										const values = { ...data.values };
										values[ choice.value ] = value;
										onUpdate( {
											...data,
											values,
										} );
									} }
								/>
							</div>
						);
					} ) }
			</div>
		</div>
	);
};

export default SingleProduct;
