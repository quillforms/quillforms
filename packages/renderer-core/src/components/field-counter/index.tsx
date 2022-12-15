/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import ArrowIcon from './arrow-icon';
import { __experimentalUseFieldRenderContext } from '../field-render/context';
import useBlockTypes from '../../hooks/use-block-types';
import useBlockTheme from '../../hooks/use-block-theme';
import { useSelect } from '@wordpress/data';

const BlockCounter: React.FC = () => {
	const { blockName, id, attributes } = __experimentalUseFieldRenderContext();
	if ( ! blockName || ! id ) return null;
	const blockTypes = useBlockTypes();
	const blockType = blockTypes[ blockName ];
	const theme = useBlockTheme( attributes?.themeId );

	const { counter } = useSelect( ( select ) => {
		return {
			counter: select( 'quillForms/renderer-core' ).getBlockCounterValue(
				id
			),
		};
	} );
	return (
		<div
			className={ classnames(
				'renderer-components-block-counter',
				css`
					color: ${ theme.questionsColor };
					font-family: ${ theme.questionsLabelFont };
					@media ( min-width: 768 ) {
						line-height: ${ theme.questionsLabelLineHeight
							.lg } !important;
					}
					@media ( max-width: 767px ) {
						line-height: ${ theme.questionsLabelLineHeight
							.sm } !important;
					}
				`
			) }
		>
			{ counter !== undefined && (
				<span className="renderer-components-block-counter__value">
					{ counter + 1 }
				</span>
			) }
			<span className="renderer-components-block-counter__content">
				{ blockType?.counterIcon ? (
					// @ts-expect-error
					<blockType.counterIcon />
				) : (
					<ArrowIcon theme={ theme } />
				) }
			</span>
		</div>
	);
};

export default BlockCounter;
