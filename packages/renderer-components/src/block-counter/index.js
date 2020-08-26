/**
 * Internal Dependencies
 */
import ArrowIcon from './arrow-icon';

const BlockCounter = ( { counter } ) => {
	return (
		<div className="renderer-components-block-counter">
			<span className="renderer-components-block-counter__value">
				{ counter }
			</span>
			<span className="renderer-components-block-counter__arrow">
				<ArrowIcon />
			</span>
		</div>
	);
};

export default BlockCounter;
