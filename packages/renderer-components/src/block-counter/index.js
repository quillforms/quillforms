/**
 * Internal Dependencies
 */
import ArrowIcon from './arrow-icon';
import { useFieldRenderContext } from '../field-render/context';
import useBlockTypes from '../hooks/use-block-types';

const BlockCounter = () => {
	const { field, counter } = useFieldRenderContext();
	const blockTypes = useBlockTypes();
	const blockType = blockTypes[ field.type ];
	return (
		<div className="renderer-components-block-counter">
			{ counter !== -1 && (
				<span className="renderer-components-block-counter__value">
					{ counter + 1 }
				</span>
			) }
			<span className="renderer-components-block-counter__content">
				{ blockType?.rendererConfig?.counterContent ? (
					<blockType.rendererConfig.counterContent />
				) : (
					<ArrowIcon />
				) }
			</span>
		</div>
	);
};

export default BlockCounter;
