/**
 * Internal Dependencies
 */
import useProgressPerecent from '../../hooks/use-progress-percent';

const ProgressMergeTag = ( { modifier } ) => {
	const percent = useProgressPerecent();
	if ( modifier === 'percent' ) {
		return (
			<span className="renderer-core-progress-merge-tag">
				{ percent }
			</span>
		);
	}
	return null;
};

export default ProgressMergeTag;
