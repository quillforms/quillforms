/**
 * Internal Dependencies
 */
import useProgressPerecent from '../../hooks/use-progress-percent';

interface Props {
	modifier: string;
}
const ProgressMergeTag: React.FC< Props > = ( { modifier } ) => {
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
