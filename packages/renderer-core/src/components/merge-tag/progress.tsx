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
		return <>{ percent }</>;
	}
	return null;
};

export default ProgressMergeTag;
