/**
 * QuillForms Dependencies
 */
import {
	Button,
	HTMLParser,
	useTheme,
	useMessages,
	useFormContext,
} from '@quillforms/renderer-core';
/**
 * WordPress Dependencies
 */
import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';
import { autop } from '@wordpress/autop';

/**
 * External Dependencies
 */
import { noop } from 'lodash';
import { css } from '@emotion/css';
import classNames from 'classnames';

const WelcomeScreenOutput = ( { attributes } ) => {
	const { isPreview } = useFormContext();
	const [ isActive, setIsActive ] = useState( false );
	const [ stickyFooter, setStickyFooter ] = useState( false );
	let label = '...';
	if ( attributes?.label ) label = attributes.label;
	const theme = useTheme();
	const screenWrapperRef = useRef();
	const screenContentRef = useRef();

	const { goToBlock } = useDispatch( 'quillForms/renderer-core' );
	const { walkPath } = useSelect( ( select ) => {
		return {
			walkPath: select( 'quillForms/renderer-core' ).getWalkPath(),
		};
	} );
	// useLayoutEffect( () => {
	// 	if (
	// 		screenContentRef.current.clientHeight + 150 >
	// 		screenWrapperRef.current.clientHeight
	// 	) {
	// 		setStickyFooter( true );
	// 	} else {
	// 		setStickyFooter( false );
	// 	}
	// } );

	useEffect( () => {
		setIsActive( true );

		return () => setIsActive( false );
	}, [] );
	let next = noop;

	if ( walkPath[ 0 ] && walkPath[ 0 ].id ) {
		next = () => goToBlock( walkPath[ 0 ].id );
	}

	return (
		<div
			className={ css`
				height: 100%;
				position: relative;
				outline: none;
			` }
			ref={ screenWrapperRef }
			tabIndex="0"
			onKeyDown={ ( e ) => {
				if ( e.key === 'Enter' ) {
					e.stopPropagation();
					next();
				}
			} }
		>
			<div
				className={ classNames( 'qf-welcome-screen-block__wrapper', {
					'with-sticky-footer': stickyFooter,
					active: isActive,
				} ) }
			>
				<div className={ 'qf-welcome-screen-block__content-wrapper' }>
					<div
						className="qf-welcome-screen-block__content"
						ref={ screenContentRef }
					>
						<Fragment>
							<div className="renderer-core-block-attachment">
								{ attributes.attachment &&
								attributes.attachment.url ? (
									<img
										alt={ '' }
										src={ attributes.attachment.url }
										className="renderer-core-block-attachment__image"
									/>
								) : (
									<>
										{ isPreview && (
											<div className="renderer-core-block-attachment__placeholder">
												<svg
													className="renderer-core-block-attachment__placeholder-icon"
													focusable="false"
													viewBox="0 0 24 24"
													role="presentation"
												>
													<circle
														cx="12"
														cy="12"
														r="3.2"
													/>
													<path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
												</svg>
											</div>
										) }
									</>
								) }
							</div>
						</Fragment>
						<div
							className={ css`
								margin-top: 25px;
							` }
						>
							<div
								className={ classNames(
									'renderer-components-block-label',
									css`
										color: ${ theme.questionsColor };
									`
								) }
							>
								<HTMLParser value={ autop( label ) } />
							</div>
							{ attributes?.description &&
								attributes.description !== '' && (
									<div
										className={ classNames(
											'renderer-components-block-description',
											css`
												color: ${ theme.questionsColor };
											`
										) }
									>
										<HTMLParser
											value={ autop(
												attributes.description
											) }
										/>
									</div>
								) }
						</div>
					</div>
					<ScreenAction
						next={ next }
						isSticky={ stickyFooter }
						buttonText={ attributes.buttonText }
					/>
				</div>
			</div>
		</div>
	);
};
const ScreenAction = ( { isSticky, buttonText, next } ) => {
	const messages = useMessages();
	const theme = useTheme();
	const isTouchScreen =
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0;

	return (
		<div
			className={ classNames( 'qf-welcome-screen-block__action-wrapper', {
				'is-sticky': isSticky,
			} ) }
		>
			<div className="qf-welcome-screen-block__action">
				<Button onClick={ next }> { buttonText } </Button>
			</div>

			<div
				className={ classNames(
					'qf-welcome-screen-block__action-helper-text',
					css`
						color: ${ theme.questionsColor };
					`
				) }
			>
				{ ! isTouchScreen && (
					<HTMLParser value={ messages[ 'label.hintText.enter' ] } />
				) }
			</div>
		</div>
	);
};
export default WelcomeScreenOutput;
