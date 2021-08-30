/**
 * Internal Dependencies
 */
import FieldMergeTag from './field';
import AttributeMergeTag from './attribute';
import ProgressMergeTag from './progress';
import { applyFilters } from '@wordpress/hooks';

interface Props {
	type: string;
	modifier: string;
}
const MergeTag: React.FC< Props > = ( { type, modifier } ) => {
	switch ( type ) {
		case 'field': {
			return <FieldMergeTag modifier={ modifier } />;
		}
		case 'attribute': {
			return <AttributeMergeTag modifier={ modifier } />;
		}
		case 'progress': {
			return <ProgressMergeTag modifier={ modifier } />;
		}
		default:
			return applyFilters(
				'QuillForms.RendererCore.MergeTag',
				null,
				type,
				modifier
			) as React.ReactElement< any, any > | null;
	}
};

export default MergeTag;
