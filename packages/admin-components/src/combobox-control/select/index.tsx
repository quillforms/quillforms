/**
 * QuillForms Dependencies
 */
import SelectControl from '../../select-control';

/**
 * WordPress Dependencies
 */
import type { CustomSelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */

/**
 * Internal Dependencies
 */
import { useComboboxControlContext } from '../context';
import Option from './option';
import { getPlainExcerpt } from '../../rich-text';

interface Props {
	hideChooseOption?: boolean;
}

const Select: React.FC< Props > = ( { hideChooseOption } ) => {
	const {
		sections,
		options,
		value,
		onChange,
		isToggleEnabled,
		placeholder,
		excerptLength,
	} = useComboboxControlContext();

	const SelectOptions: CustomSelectControl.Option[] = [
		{
			key: 'select',
			name: (
				<Option
					label={
						placeholder ?? __( 'Choose an option', 'quillforms' )
					}
				/>
			),
			style: hideChooseOption ? { display: 'none' } : {},
		},
	];
	// add each section with related options.
	for ( const section of sections ) {
		SelectOptions.push( {
			key: section.key,
			name: (
				<div onClick={ ( ev ) => ev.stopPropagation() }>
					{ section.label }
				</div>
			),
			className: 'combobox-control-select-section',
		} );
		options.forEach( ( option, index ) => {
			if ( option.section === section.key ) {
				SelectOptions.push( {
					key: index,
					name: (
						<Option
							label={ getPlainExcerpt(
								option.label,
								excerptLength
							) }
							iconBox={ option.iconBox }
							hasSection
						/>
					),
				} );
			}
		} );
	}
	// add options of undefined section.
	options.forEach( ( option, index ) => {
		if ( option.section === undefined ) {
			SelectOptions.push( {
				key: index,
				name: (
					<Option label={ option.label } iconBox={ option.iconBox } />
				),
			} );
		}
	} );
	// add custom value option.
	if ( isToggleEnabled ) {
		SelectOptions.push( {
			key: 'toggle',
			name: <Option label={ __( 'Custom Value', 'quillforms' ) } />,
		} );
	}

	return (
		<div className="combobox-control-select">
			<SelectControl
				label=""
				value={
					SelectOptions.find(
						( option ) =>
							Number.isInteger( option.key ) &&
							options[ option.key ].type === value.type &&
							options[ option.key ].value === value.value
					) ?? SelectOptions[ 0 ]
				}
				onChange={ ( { selectedItem } ) => {
					if ( selectedItem ) {
						if ( selectedItem.key === 'select' ) {
							// clear selection
							onChange( {} );
						} else if ( selectedItem.key === 'toggle' ) {
							// toggle to rich text editor
							onChange( { type: 'text' } );
						} else if ( Number.isInteger( selectedItem.key ) ) {
							// update selected value
							const option = options[ selectedItem.key ];
							onChange( {
								type: option.type,
								value: option.value,
							} );
						}
					}
				} }
				options={ SelectOptions }
			/>
		</div>
	);
};

export default Select;
