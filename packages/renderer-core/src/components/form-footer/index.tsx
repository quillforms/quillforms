/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { memo } from '@wordpress/element';

/**
 *
 * External Dependencies
 */
import classnames from 'classnames';
import FieldNavigation from '../field-navigation';
import { css } from 'emotion';
import tinyColor from 'tinycolor2';

/**
 * Internal Dependencies
 */
import ProgressBar from '../progress-bar';
import { useCurrentTheme, useFormContext } from '../../hooks';

const FormFooter: React.FC = memo( () => {
	const theme = useCurrentTheme();
	const { formObj } = useFormContext();
	const {
		currentBlockId,
		isWelcomeScreenActive,
		isThankyouScreenActive,
		shouldFooterBeDisplayed,
	} = useSelect( ( select ) => {
		return {
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
			isThankyouScreenActive: select(
				'quillForms/renderer-core'
			).isThankyouScreenActive(),
			isWelcomeScreenActive: select(
				'quillForms/renderer-core'
			).isWelcomeScreenActive(),
			shouldFooterBeDisplayed: select(
				'quillForms/renderer-core'
			).shouldFooterBeDisplayed(),
		};
	} );

	if ( ! currentBlockId ) return null;
	return (
		<div
			className={ classnames(
				'renderer-components-form-footer',
				{
					hidden:
						isWelcomeScreenActive ||
						isThankyouScreenActive ||
						! shouldFooterBeDisplayed,
				},
				css`
					@media ( max-width: 600px ) {
						background: ${ tinyColor( theme.backgroundColor )
							.setAlpha( 0.75 )
							.toString() };
					}
				`
			) }
			tabIndex={ -1 }
		>
			{ ! formObj?.settings?.disableProgressBar && <ProgressBar /> }
			{ ! formObj?.settings?.disableNavigationArrows && (
				<FieldNavigation />
			) }
		</div>
	);
} );

export default FormFooter;
