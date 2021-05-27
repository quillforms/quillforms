/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { Fragment, useEffect } from '@wordpress/element';
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
import useFormContext from '../../hooks/use-form-context';

interface Props {
	applyLogic: boolean;
}
const FormFlow: React.FC< Props > = ( { applyLogic } ) => {
	const blocks = useBlocks();
	const theme = useTheme();
	const { isWelcomeScreenActive, isThankyouScreenActive } = useSelect(
		( select ) => {
			return {
				isThankyouScreenActive: select(
					'quillForms/renderer-core'
				).isThankyouScreenActive(),
				isWelcomeScreenActive: select(
					'quillForms/renderer-core'
				).isWelcomeScreenActive(),
			};
		}
	);

	const keydownHandler = ( e ) => {
		// Prevent any keyboard event by default in case of any tab event in general.
		if ( e.key === 'Tab' ) {
			e.preventDefault();
			return;
		}
	};

	useEffect( () => {
		window.addEventListener( 'keydown', keydownHandler );

		return () => {
			window.removeEventListener( 'keydown', keydownHandler );
		};
	}, [] );

	let backgroundImageCSS = '';
	if ( theme.backgroundImage && theme.backgroundImage ) {
		backgroundImageCSS = `background: url('${ theme.backgroundImage }') no-repeat;
			background-size: cover;
			background-position: center;
		`;
	}

	return (
		<div
			className={ classnames(
				css`
					${ backgroundImageCSS };
					height: 100%;
					width: 100%;
				`,
				'renderer-core-form-flow__wrapper'
			) }
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
