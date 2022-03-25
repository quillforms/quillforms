/**
 * QuillForms Dependencies
 */
import { IconRenderer } from '@quillforms/types';

/**
 * Internal Dependencies
 */
import { MappingValueControlContextProvider } from './context';
import RichText from './rich-text';
import Select from './select';
import useFields from './use-fields';
import useVariables from './use-variables';

export type Sections = { key: string; label: string }[];
export type Options = {
	type: string;
	value: string;
	label: string;
	iconBox?: {
		icon?: IconRenderer;
		color?: string;
	};
	// section must exist if defined.
	section?: string;
	// will the option be included in rich text editor merge tags?
	isMergeTag?: boolean;
	// can hold other data for filters like block name.
	other?: {
		[ x: string ]: any;
	};
}[];
export type MappingValue = {
	type?: string;
	value?: string;
};
export type CustomizeObject = {
	sections: Sections;
	options: Options;
};

export type MappingValueControlProps = {
	// if type is text, the component will load rich text editor. else the component will load the select.
	value: MappingValue;
	onChange: ( value: MappingValue ) => void;
	// if true, select component will have custom value option that loads rich text
	// and rich text editor will have back/exit button to loads select. (default true)
	isToggleEnabled?: boolean;
	// customize sections and options.
	customize?: ( value: CustomizeObject ) => CustomizeObject;
};

const MappingValueControl: React.FC< MappingValueControlProps > = ( {
	value,
	onChange,
	isToggleEnabled = true,
	customize,
} ) => {
	const fields = useFields( { section: 'fields' } );
	const variables = useVariables( { section: 'variables' } );

	let sections: Sections = [];
	let options: Options = [];

	// fields
	if ( fields.length ) {
		sections.push( {
			key: 'fields',
			label: 'Fields',
		} );
		options = options.concat( fields );
	}
	// variables
	if ( variables.length ) {
		sections.push( {
			key: 'variables',
			label: 'Variables',
		} );
		options = options.concat( variables );
	}
	// entry properties
	const EntryProperties = [
		{
			value: 'id',
			label: 'Entry ID',
		},
		{
			value: 'form_id',
			label: 'Form ID',
		},
		{
			value: 'date_created',
			label: 'Entry Date (YYYY-MM-DD)',
		},
		{
			value: 'user_id',
			label: 'User ID',
		},
		{
			value: 'user_ip',
			label: 'User IP Address',
		},
		{
			value: 'user_agent',
			label: 'HTTP User Agent',
		},
	];
	sections.push( {
		key: 'entry_properties',
		label: 'Entry Properties',
	} );
	options = options.concat(
		EntryProperties.map( ( property ) => {
			return {
				type: 'property',
				value: property.value,
				label: property.label,
				section: 'entry_properties',
				isMergeTag: true,
			};
		} )
	);

	if ( customize ) {
		let customized = customize( { sections, options } );
		sections = customized.sections;
		options = customized.options;
	}

	return (
		<div className="mapping-value-control">
			<MappingValueControlContextProvider
				value={ {
					sections,
					options,
					value,
					onChange,
					isToggleEnabled,
				} }
			>
				{ value.type === 'text' ? <RichText /> : <Select /> }
			</MappingValueControlContextProvider>
		</div>
	);
};

export default MappingValueControl;
