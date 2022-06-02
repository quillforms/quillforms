/**
 * Internal Dependencies
 */
import { MappingKeyControlContextProvider } from './context';
import Text from './text';
import Select from './select';

export type Sections = { key: string; label: string }[];
export type Option = {
	value: string;
	label: string;
	// section must exist if defined.
	section?: string;
	isStarred?: boolean;
};
export type Options = Option[];

export type MappingKeyControlProps = {
	sections?: Sections;
	// if options isn't defined, the component will load text field.
	options?: Options;
	value: string;
	onChange: ( value: string ) => void;
	disabled?: boolean;
};

const MappingKeyControl: React.FC< MappingKeyControlProps > = ( {
	sections = [],
	options,
	value,
	onChange,
	disabled,
} ) => {
	return (
		<div className="mapping-key-control">
			<MappingKeyControlContextProvider
				value={ {
					value,
					onChange,
					disabled,
				} }
			>
				{ options ? (
					<Select sections={ sections } options={ options } />
				) : (
					<Text />
				) }
			</MappingKeyControlContextProvider>
		</div>
	);
};

export default MappingKeyControl;
