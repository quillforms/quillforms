/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
import { useTheme } from '../../hooks';
import DownIcon from './down-icon';
import UpIcon from './up-icon';

const FieldNavigation = () => {
	const { goNext, goPrev } = useDispatch( 'quillForms/renderer-core' );
	const theme = useTheme();
	const { currentBlockId, walkPath } = useSelect( ( select ) => {
		return {
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
			walkPath: select( 'quillForms/renderer-core' ).getWalkPath(),
		};
	} );
	return (
		<div className="renderer-core-field-navigation">
			<div
				className={ classnames(
					'renderer-core-field-navigation__up-icon',
					css`
						background: ${ theme.buttonsBgColor };
					`
				) }
				onClick={ () => {
					goPrev();
				} }
			>
				<UpIcon />
			</div>
			<div
				className={ classnames(
					'renderer-core-field-navigation__down-icon',
					css`
						background: ${ theme.buttonsBgColor };
					`
				) }
				onClick={ () => {
					if (
						walkPath[ walkPath.length - 1 ].id !== currentBlockId
					) {
						goNext();
					}
				} }
			>
				<DownIcon />
			</div>
		</div>
	);
};
export default FieldNavigation;
