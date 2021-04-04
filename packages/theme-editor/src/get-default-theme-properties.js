import ConfigAPI from '@quillforms/config';
import { reduce } from 'lodash';

const getDefaultThemeProperties = () => {
	const themeStructure = ConfigAPI.getThemeStructure();
	const res = reduce(
		themeStructure,
		( accumulator, schema, key ) => {
			if ( schema.hasOwnProperty( 'default' ) ) {
				accumulator[ key ] = schema.default;
			}

			return accumulator;
		},
		{}
	);
	return res;
};
export default getDefaultThemeProperties;
