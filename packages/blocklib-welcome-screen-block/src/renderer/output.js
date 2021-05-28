/**
 * QuillForms Dependencies
 */
import {
	Button,
	HTMLParser,
	useTheme,
	useMessages,
} from '@quillforms/renderer-core';
/**
 * WordPress Dependencies
 */
import {
	useState,
	useLayoutEffect,
	useRef,
	useEffect,
} from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { autop } from '@wordpress/autop';

/**
 * External Dependencies
 */
import { noop } from 'lodash';
import { css } from 'emotion';
import classNames from 'classnames';

const WelcomeScreenOutput = ( { attributes } ) => {
	const [ isActive, setIsActive ] = useState( false );
	const [ stickyFooter, setStickyFooter ] = useState( false );
	let label = '...';
	if ( attributes?.label ) label = attributes.label;
	const theme = useTheme();
	// // // console.log(isActive);
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
						{ /* <BlockAttachment
								forceAttachment={ true }
								attachment={ attachment }
							/> */ }
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
				<HTMLParser value={ messages[ 'label.hintText.enter' ] } />
			</div>
		</div>
	);
};
export default WelcomeScreenOutput;
