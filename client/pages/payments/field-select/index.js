/**
 * QuillForms Dependencies
 */
import { getPlainExcerpt } from '@quillforms/rich-text';
import { SelectControl } from '@quillforms/admin-components';
import ConfigAPI from '@quillforms/config';

/**
 * Wordpress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import './style.scss';
import BlockItem from './block-item';
import VariableItem from './variable-item';

const FieldSelect = ( {
	label,
	className,
	blockNames,
	includeVariables,
	value,
	onChange,
} ) => {
	const { blockTypes } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );
	const blocks = ( ConfigAPI.getInitialPayload().blocks ?? [] ).filter(
		( block ) => {
			return (
				blockTypes[ block.name ].supports.editable === true &&
				( blockNames === undefined ||
					blockNames.includes( block.name ) )
			);
		}
	);

	const options = [
		{
			key: '',
			name: __( 'Choose field', 'quillforms' ),
		},
	];
	if ( blocks.length > 0 ) {
		blocks.forEach( ( block ) => {
			options.push( {
				key: block.id,
				type: 'field',
				name: (
					<BlockItem
						id={ block.id }
						name={ block.name }
						label={ getPlainExcerpt( block.attributes?.label ) }
					/>
				),
			} );
		} );
	}
	if ( includeVariables ) {
		for ( const [ key, data ] of Object.entries(
			ConfigAPI.getInitialPayload().logic?.variables ?? {}
		) ) {
			options.push( {
				key: key,
				type: 'variable',
				name: (
					<VariableItem
						id={ key }
						label={ getPlainExcerpt( data.label ) }
					/>
				),
			} );
		}
	}

	if ( options.length === 1 ) {
		return (
			<div className="quillforms-payments-page-field-select quillforms-payments-page-field-select-empty">
				{ __( 'No supported fields in the form.', 'quillforms' ) }
			</div>
		);
	}

	return (
		<div
			className={
				'quillforms-payments-page-field-select ' + ( className ?? '' )
			}
		>
			<SelectControl
				label={ label ?? '' }
				className={ css`
					margin-top: 0 !important;
				` }
				value={
					options.find( ( option ) => option.key === value ) ??
					options[ 0 ]
				}
				onChange={ ( { selectedItem } ) => {
					if ( selectedItem ) {
						const type =
							options.find(
								( option ) => option.id === selectedItem.key
							)?.type ?? null;
						onChange( selectedItem.key, type );
					}
				} }
				options={ options }
			/>
		</div>
	);
};

export default FieldSelect;
