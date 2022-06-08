/**
 * QuillForms Dependencies
 */
import { LogicConditionOperator } from '@quillforms/types';
import SelectControl from '../../select-control';

const options = [
	{
		key: 'is',
		name: 'is',
	},
	{
		key: 'is_not',
		name: 'is not',
	},
	{
		key: 'lower_than',
		name: 'lower than',
	},
	{
		key: 'greater_than',
		name: 'greater than',
	},
	{
		key: 'starts_with',
		name: 'starts with',
	},
	{
		key: 'ends_with',
		name: 'ends with',
	},
	{
		key: 'contains',
		name: 'contains',
	},
	{
		key: 'not_contains',
		name: "doesn't contain",
	},
];

interface Props {
	value: string | null;
	onChange: ( value: LogicConditionOperator ) => void;
	operators: LogicConditionOperator[];
}

const OperatorSelector: React.FC< Props > = ( {
	value,
	onChange,
	operators,
} ) => {
	const $options = options.filter( ( option ) =>
		// @ts-ignore
		operators.includes( option.key )
	);

	if ( ! value ) {
		setTimeout( () => onChange( operators[ 0 ] ) );
		return null;
	}

	return (
		<div>
			<SelectControl
				value={ options.find( ( option ) => option.key === value ) }
				onChange={ ( selectedChoice ) => {
					if ( selectedChoice && selectedChoice.selectedItem ) {
						onChange( selectedChoice.selectedItem.key );
					}
				} }
				options={ $options }
			/>
		</div>
	);
};

export default OperatorSelector;
