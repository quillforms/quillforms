import { memo } from '@wordpress/element';

// Preventing re-render unless current block changes
const areEqual = ( prevProps, nextProps ) => {
	if ( prevProps.currentBlockId === nextProps.currentBlockId ) return true;
	return false;
};

const ProgressBar = memo( ( { totalQuestions, answered } ) => {
	const percent = Math.round( ( answered * 100 ) / totalQuestions );

	return (
		<div className="renderer-core-progress-bar">
			<div className="renderer-core-progress-bar__label">
				{ percent }% completed
			</div>
			<div className="renderer-core-progress-bar__track">
				<div
					className="renderer-core-progress-bar__fill"
					style={ { width: percent + '%' } }
				/>
			</div>
		</div>
	);
}, areEqual );

export default ProgressBar;
