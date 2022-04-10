/**
 * QuillForms Dependencies
 */
import SelectControl from '../../../select-control';

/**
 * WordPress Dependencies
 */
import type { CustomSelectControl } from '@wordpress/components';
import { Disabled } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { useMappingKeyControlContext } from '../context';
import Option from './option';
import type { Options, Sections } from '..';

interface Props {
	sections: Sections;
	options: Options;
}

const Select: React.FC< Props > = ( { sections, options } ) => {
	const { value, onChange, disabled } = useMappingKeyControlContext();

	const SelectOptions: CustomSelectControl.Option[] = [
		{
			key: 'select',
			name: <Option label={ __( 'Choose an option', 'quillforms' ) } />,
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
			className: 'mapping-key-control-select-section',
		} );
		options.forEach( ( option, index ) => {
			if ( option.section === section.key ) {
				SelectOptions.push( {
					key: index,
					name: (
						<Option
							label={ option.label }
							isStarred={ option.isStarred }
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
					<Option
						label={ option.label }
						isStarred={ option.isStarred }
					/>
				),
			} );
		}
	} );

	const component = (
		<div className="mapping-key-control-select">
			<SelectControl
				label=""
				value={
					SelectOptions.find(
						( option ) =>
							Number.isInteger( option.key ) &&
							options[ option.key ].value === value
					) ?? SelectOptions[ 0 ]
				}
				onChange={ ( { selectedItem } ) => {
					if ( selectedItem ) {
						if ( selectedItem.key === 'select' ) {
							// clear
							onChange( '' );
						} else if ( Number.isInteger( selectedItem.key ) ) {
							// update selected value
							const option = options[ selectedItem.key ];
							onChange( option.value );
						}
					}
				} }
				options={ SelectOptions }
			/>
		</div>
	);

	return disabled ? <Disabled>{ component }</Disabled> : component;
};

export default Select;
