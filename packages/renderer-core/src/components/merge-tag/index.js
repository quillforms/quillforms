/**
 * Internal Dependencies
 */
import FieldMergeTag from './field';

const MergeTag = ( { type, modifier } ) => {
	switch ( type ) {
		case 'field': {
			return <FieldMergeTag modifier={ modifier } />;
		}
		default:
			return null;
	}
};

export default MergeTag;
