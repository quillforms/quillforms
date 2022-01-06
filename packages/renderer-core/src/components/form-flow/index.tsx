/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { Fragment, useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import WelcomeScreensWrapper from '../welcome-screens-wrapper';
import ThankyouScreensWrapper from '../thankyou-screens-wrapper';
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
	const { setIsFocused } = useDispatch( 'quillForms/renderer-core' );
	const ref = useRef( null );
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

	useEffect( () => {
		/**
		 * Alert if clicked on outside of element
		 */
		function handleClickOutside( event ) {
			if ( ref.current && ! ref.current.contains( event.target ) ) {
				setIsFocused( false );
			}
		}

		// Bind the event listener
		document.addEventListener( 'mousedown', handleClickOutside );
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener( 'mousedown', handleClickOutside );
		};
	}, [ ref ] );

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
			ref={ ref }
			className={ classnames(
				css`
					${ backgroundImageCSS };
					height: 100%;
					width: 100%;
				`,
				'renderer-core-form-flow__wrapper'
			) }
			tabIndex={ 0 }
			onMouseDown={ () => setIsFocused( true ) }
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
				onClick={ () => {
					setIsFocused( true );
				} }
			>
				{ blocks.length > 0 && (
					<Fragment>
						{ isWelcomeScreenActive && <WelcomeScreensWrapper /> }
						<FieldsWrapper
							isActive={
								! isWelcomeScreenActive &&
								! isThankyouScreenActive
							}
							applyLogic={ applyLogic }
						/>

						{ isThankyouScreenActive && <ThankyouScreensWrapper /> }
					</Fragment>
				) }
				<FormFooter />
			</div>
		</div>
	);
};
export default FormFlow;
