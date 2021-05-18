/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import WelcomeScreensFlow from '../welcome-screens-flow';
import ThankyouScreensFlow from '../thankyou-screens-flow';
import FieldsWrapper from '../fields-wrapper';
import FormFooter from '../form-footer';
import useTheme from '../../hooks/use-theme';
import useBlocks from '../../hooks/use-blocks';

interface Props {
	applyLogic: boolean;
}
const FormFlow: React.FC< Props > = ( { applyLogic } ) => {
	const blocks = useBlocks();
	const theme = useTheme();
	const {
		isWelcomeScreenActive,
		isThankyouScreenActive,
		isAnimating,
	} = useSelect( ( select ) => {
		return {
			isThankyouScreenActive: select(
				'quillForms/renderer-core'
			).isThankyouScreenActive(),
			isWelcomeScreenActive: select(
				'quillForms/renderer-core'
			).isWelcomeScreenActive(),
			isAnimating: select( 'quillForms/renderer-core' ).isAnimating(),
		};
	} );

	let backgroundImageCSS = '';
	if ( theme.backgroundImage && theme.backgroundImage ) {
		backgroundImageCSS = `background: url('${ theme.backgroundImage }') no-repeat;
			background-size: cover;
			background-position: center;
		`;
	}

	return (
		<div
			className={ css`
				${ backgroundImageCSS };
				height: 100%;
				width: 100%;
			` }
			onKeyDown={ ( e: KeyboardEvent ): void => {
				// Prevent any keyboard event by default
				// The reason for this is to prevent tab keyboard event especially on first render as it causes the animation to be corrupted.
				if ( isAnimating ) {
					e.preventDefault();
					return;
				}
				//tab?
				if ( e.key === 'Tab' ) {
					e.preventDefault();
				}
			} }
			tabIndex={ 0 }
		>
			<div
				className={ classnames(
					'renderer-core-form-flow',
					css`
						background: ${ theme.backgroundColor };
						font-family: ${ theme.font };
						position: relative;
						width: 100%;
						height: 100%;
						overflow: hidden;

						textarea,
						input {
							font-family: ${ theme.font };
						}
					`
				) }
			>
				{ blocks.length > 0 && (
					<Fragment>
						{ isWelcomeScreenActive && <WelcomeScreensFlow /> }
						{ ! isWelcomeScreenActive &&
							! isThankyouScreenActive && (
								<FieldsWrapper applyLogic={ applyLogic } />
							) }

						{ isThankyouScreenActive && <ThankyouScreensFlow /> }
					</Fragment>
				) }
				<FormFooter />
			</div>
		</div>
	);
};
export default FormFlow;
