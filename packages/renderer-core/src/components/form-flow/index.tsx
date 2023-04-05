/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
/**
 * Quill Forms Dependencies
 */
import configApi from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { Fragment, useEffect, useRef } from 'react';
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
import useGeneralTheme from '../../hooks/use-general-theme';
import useBlocks from '../../hooks/use-blocks';
import PaymentModal from '../payment-modal';
import useCurrentTheme from '../../hooks/use-current-theme';
import { forEach, size } from 'lodash';
import { useFormContext, useFormSettings } from '../../hooks';

interface Props {
	applyLogic: boolean;
}
const FormFlow: React.FC< Props > = ( { applyLogic } ) => {
	const blocks = useBlocks();
	const { formObj } = useFormContext();
	const generalTheme = useGeneralTheme();
	const currentTheme = useCurrentTheme();
	const fonts = configApi.getFonts();
	const showLettersOnAnswers =
		useFormSettings()?.showLettersOnAnswers ?? true;

	const { font, questionsLabelFont, questionsDescriptionFont } = currentTheme;

	const fontFamilies = [ font ];
	if ( questionsLabelFont !== 'inherit' ) {
		fontFamilies.push( questionsLabelFont );
	}
	if ( questionsDescriptionFont !== 'inherit' ) {
		fontFamilies.push( questionsDescriptionFont );
	}
	const fontTypes = [
		fonts[ font ],
		fonts[ questionsLabelFont ],
		fonts[ questionsDescriptionFont ],
	];
	const fontUrls: string[] = [];
	forEach( fontFamilies, ( fontFamily, fontIndex ) => {
		const fontType = fontTypes[ fontIndex ];
		switch ( fontType ) {
			case 'googlefonts':
				fontUrls.push(
					'https://fonts.googleapis.com/css?family=' +
						fontFamily +
						':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic'
				);
				break;

			case 'earlyaccess':
				const fontLowerString = fontFamily
					.replace( /\s+/g, '' )
					.toLowerCase();
				fontUrls.push(
					'https://fonts.googleapis.com/earlyaccess/' +
						fontLowerString +
						'.css'
				);
				break;
		}
	} );

	useEffect( () => {
		const head = document.head;
		const link = document.createElement( 'link' );

		link.type = 'text/css';
		link.rel = 'stylesheet';
		if ( size( fontUrls ) > 0 ) {
			forEach( fontUrls, ( fontUrl ) => {
				link.href = fontUrl;
				const existingLinkEl = document.querySelector(
					`link[href='${ link.href }']`
				);
				if ( ! existingLinkEl ) head.appendChild( link );
			} );
		}
	}, [ font, questionsLabelFont, questionsDescriptionFont ] );

	const { setIsFocused } = useDispatch( 'quillForms/renderer-core' );
	const ref = useRef< any >( null );
	const { isWelcomeScreenActive, isThankyouScreenActive, paymentData } =
		useSelect( ( select ) => {
			const store = select( 'quillForms/renderer-core' );
			return {
				isThankyouScreenActive: store.isThankyouScreenActive(),
				isWelcomeScreenActive: store.isWelcomeScreenActive(),
				paymentData: store.getPaymentData(),
			};
		} );

	useEffect( () => {
		/**
		 * Alert if clicked on outside of element
		 *
		 * @param  event
		 */
		function handleClickOutside( event ) {
			if ( ref.current && ! ref?.current?.contains( event.target ) ) {
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
		}
	};

	useEffect( () => {
		window.addEventListener( 'keydown', keydownHandler );

		return () => {
			window.removeEventListener( 'keydown', keydownHandler );
		};
	}, [] );

	let backgroundImageCSS = '';
	if ( generalTheme.backgroundImage && generalTheme.backgroundImage ) {
		backgroundImageCSS = `background-image: url('${
			generalTheme.backgroundImage
		}');
			background-size: cover;
			background-position: ${
				// @ts-expect-error
				parseFloat( generalTheme.backgroundImageFocalPoint?.x ) * 100
			}%
			${
				// @ts-expect-error
				parseFloat( generalTheme.backgroundImageFocalPoint?.y ) * 100
			}%;

			background-repeat: no-repeat;
		`;
	}

	return (
		<div
			ref={ ref }
			className={ classnames(
				css`
					height: 100%;
					width: 100%;
					-webkit-font-smoothing: antialiased;
					${ backgroundImageCSS }
					${ formObj?.customCSS }
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
						position: relative;
						width: 100%;
						height: 100%;
						overflow: hidden;
						background: ${ generalTheme.backgroundColor };
						@media ( min-width: 768px ) {
							font-size: ${ generalTheme.fontSize.lg };
							line-height: ${ generalTheme.fontLineHeight.lg };
						}
						@media ( max-width: 767px ) {
							font-size: ${ generalTheme.fontSize.sm };
							line-height: ${ generalTheme.fontLineHeight.sm };
						}
						font-family: ${ generalTheme.font };
						.renderer-components-block-label {
							color: ${ generalTheme.questionsColor };
							font-family: ${ generalTheme.questionsLabelFont };
							@media ( min-width: 768 ) {
								font-size: ${ generalTheme
									.questionsLabelFontSize.lg };
								line-height: ${ generalTheme
									.questionsLabelLineHeight.lg };
							}
							@media ( max-width: 767px ) {
								font-size: ${ generalTheme
									.questionsLabelFontSize.sm };
								line-height: ${ generalTheme
									.questionsLabelLineHeight.sm };
							}
						}
						.renderer-components-block-description {
							font-family: ${ generalTheme.questionsDescriptionFont };

							@media ( min-width: 768px ) {
								font-size: ${ generalTheme
									.questionsDescriptionFontSize.lg };
								line-height: ${ generalTheme
									.questionsDescriptionLineHeight.lg };
							}
							@media ( max-width: 767px ) {
								font-size: ${ generalTheme
									.questionsDescriptionFontSize.sm };
								line-height: ${ generalTheme
									.questionsDescriptionLineHeight.sm };
							}
						}

						input,
						textarea {
							@media ( min-width: 768px ) {
								font-size: ${ generalTheme.textInputAnswers
									.lg };
								line-height: ${ generalTheme.textInputAnswers
									.lg };
							}
							@media ( max-width: 767px ) {
								font-size: ${ generalTheme.textInputAnswers
									.sm };
								line-height: ${ generalTheme.textInputAnswers
									.sm };
							}
						}

						${ ! showLettersOnAnswers &&
						`
							.pictureChoice__optionKey, .multipleChoice__optionKey {
								display: none !important;
							}
						` }
					`
				) }
				onClick={ () => {
					setIsFocused( true );
				} }
			>
				{ generalTheme?.logo?.src && (
					<div className="renderer-core-form-brand-logo">
						<img src={ generalTheme.logo.src } alt="" />
					</div>
				) }
				{ blocks.length > 0 && (
					<Fragment>
						{ isWelcomeScreenActive && <WelcomeScreensWrapper /> }
						{ ! paymentData && (
							<FieldsWrapper
								isActive={
									! isWelcomeScreenActive &&
									! isThankyouScreenActive
								}
								applyLogic={ applyLogic }
							/>
						) }

						{ isThankyouScreenActive && <ThankyouScreensWrapper /> }
					</Fragment>
				) }
				{ ! paymentData && <FormFooter /> }
				{ !! paymentData && <PaymentModal data={ paymentData } /> }
			</div>
		</div>
	);
};
export default FormFlow;
