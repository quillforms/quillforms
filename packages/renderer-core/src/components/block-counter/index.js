/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import ArrowIcon from './arrow-icon';
import { useFieldRenderContext } from '../field-render/context';
import useBlockTypes from '../../hooks/use-block-types';
import useTheme from '../../hooks/use-theme';
import { useSelect } from '@wordpress/data';

const BlockCounter = () => {
	const { type, id } = useFieldRenderContext();
	const blockTypes = useBlockTypes();
	const blockType = blockTypes[ type ];
	const theme = useTheme();
	const { pathEditableFields } = useSelect( ( select ) => {
		return {
			pathEditableFields: select(
				'quillForms/renderer-core'
			).getEditableFieldsInCurrentPath(),
		};
	} );
	const counter = pathEditableFields.findIndex(
		( editableField ) => editableField.id === id
	);
	return (
		<div
			className={ classnames(
				'renderer-components-block-counter',
				css`
					color: ${theme.questionsColor};
				`
			) }
		>
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
