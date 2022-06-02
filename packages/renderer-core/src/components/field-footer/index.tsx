/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import EditableBlockFooter from './editable';
import NonEditableBlockFooter from './non-editable';
import { __experimentalUseFieldRenderContext } from '../field-render';

/**
 * External Dependencies
 */
import Loader from 'react-loader-spinner';
import { useBlockTheme } from '../../hooks';
import { css } from 'emotion';

export interface BlockFooterProps {
	shakingErr: string | null;
	isPending: boolean;
}
const BlockFooter: React.FC< BlockFooterProps > = ( {
	shakingErr,
	isPending,
} ) => {
	const { id, blockName, attributes } = __experimentalUseFieldRenderContext();
	const blockTheme = useBlockTheme( attributes?.themeId );
	if ( ! blockName ) return null;
	const { isEditable } = useSelect( ( select ) => {
		return {
			isEditable: select( 'quillForms/blocks' ).hasBlockSupport(
				blockName,
				'editable'
			),
		};
	} );
	return (
		<div className="renderer-core-field-footer">
			{ isPending ? (
				<Loader
					className={ css`
						margin: 10px;
					` }
					type="TailSpin"
					color={ blockTheme.answersColor }
					height={ 30 }
					width={ 30 }
				/>
			) : (
				<>
					{ ! isEditable ? (
						<NonEditableBlockFooter />
					) : (
						<EditableBlockFooter
							id={ id }
							shakingErr={ shakingErr }
						/>
					) }
				</>
			) }
		</div>
	);
};
export default BlockFooter;
