/**
 * WordPress Dependencies
 */
import { Option, Sections } from '../mapping-row/key-control';
import { CustomizeFunction } from '../combobox-control';
import { useState, useEffect, useMemo } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import MappingRow from '../mapping-row';

type Options = ( Option & {
	required?: boolean; // makes the option disabled and added by default.
	combobox?: {
		customize?: CustomizeFunction;
	};
} )[];

type MappingRowValue = {
	key: string;
	value: {
		type?: string;
		value?: string;
	};
};

type Fields = {
	[ key: string ]: { type: string; value: string };
};

interface Props {
	sections?: Sections; // key sections.
	options?: Options; // key options.
	initial?: Fields; // used for setup initial mapping rows state.
	onChange: ( fields: Fields ) => void; // fields contain only the data of valid rows.
}

const MappingList: React.FC< Props > = ( {
	sections,
	options,
	initial,
	onChange,
} ) => {
	// initial mapping rows.
	const initialMappingRows: MappingRowValue[] = useMemo( () => {
		const result: MappingRowValue[] = [];
		// first add the initial fields.
		for ( const [ key, value ] of Object.entries( initial ?? {} ) ) {
			result.push( {
				key,
				value,
			} );
		}
		// then add the required options.
		for ( const option of options ?? [] ) {
			if (
				option.required &&
				! result.find( ( item ) => item.key === option.value )
			) {
				result.push( {
					key: option.value,
					value: {},
				} );
			}
		}
		// add an empty option if there is no options added.
		if ( result.length === 0 ) {
			result.push( {
				key: '',
				value: {},
			} );
		}
		return result;
	}, [] );

	// mapping rows state.
	const [ mappingRows, setMappingRows ] = useState< MappingRowValue[] >(
		initialMappingRows
	);
	const selectedKeys = mappingRows.map( ( row ) => row.key );

	// call onChange
	useEffect( () => {
		const fields = {};
		for ( const { key, value } of mappingRows ) {
			if ( key && value.type && value.value ) {
				fields[ key ] = value;
			}
		}
		onChange( fields );
	}, [ mappingRows ] );

	return (
		<div>
			{ mappingRows.map( ( fieldRow, index ) => {
				const option = options?.find(
					( option ) => option.value === fieldRow.key
				);
				return (
					<MappingRow
						key={ index }
						keyProps={ {
							sections: sections,
							options: options?.filter(
								( option ) =>
									option.value === fieldRow.key ||
									! selectedKeys.includes( option.value )
							),
							value: fieldRow.key,
							onChange: ( key ) => {
								setMappingRows( ( state ) => {
									const newState = [ ...state ];
									newState[ index ] = {
										key,
										value: {},
									};
									return newState;
								} );
							},
							disabled: option?.required,
						} }
						valueProps={ {
							value: fieldRow.value,
							onChange: ( value ) => {
								setMappingRows( ( state ) => {
									const newState = [ ...state ];
									newState[ index ].value = value;
									return newState;
								} );
							},
							customize: option?.combobox?.customize,
						} }
						onAddClick={ () => {
							setMappingRows( ( state ) => {
								const newState = [ ...state ];
								newState.splice( index + 1, 0, {
									key: '',
									value: {},
								} );
								return newState;
							} );
						} }
						onRemoveClick={
							option?.required || mappingRows.length === 1
								? undefined
								: () => {
										setMappingRows( ( state ) => {
											const newState = [ ...state ];
											newState.splice( index, 1 );
											return newState;
										} );
								  }
						}
					/>
				);
			} ) }
		</div>
	);
};

export default MappingList;
