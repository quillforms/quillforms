import { join, size } from 'lodash';

interface Props {
	val: unknown;
}
const DefaultMergeTag: React.FC< Props > = ( { val } ) => {
	const getDefaultMergeTagVal = () => {
		const defaultValueIfNull = '_ _ _ _ _';
		if ( val ) {
			if ( Array.isArray( val ) ) {
				if ( size( val ) > 0 ) {
					return join( val, ',' );
				}
				return defaultValueIfNull;
			} else if ( typeof val === 'object' ) {
				if ( size( val ) > 0 ) return JSON.stringify( val );
				return defaultValueIfNull;
			}
			return val;
		}
		return defaultValueIfNull;
	};

	return <>{ getDefaultMergeTagVal() }</>;
};

export default DefaultMergeTag;
