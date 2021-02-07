/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * WordPress Dependencies
 */
import { Fragment, useEffect, useCallback } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { Lethargy } from 'lethargy';
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import SubmissionScreen from '../submission-screen';
import DefaultThankYouScreen from '../default-thankyou-screen';
import FieldsWrapper from '../fields-wrapper';
import FieldRender from '../field-render';
import FormFooter from '../form-footer';
import useBlockTypes from '../../hooks/use-block-types';
import useTheme from '../../hooks/use-theme';
import useBlocks from '../../hooks/use-blocks';

let lastScrollDate = 0;
const lethargy = new Lethargy();
const FormFlow = ( { applyLogic } ) => {
	const blockTypes = useBlockTypes();
	const blocks = useBlocks();
	const theme = useTheme();
	const { swiper } = useSelect( ( select ) => {
		return {
			swiper: select( 'quillForms/renderer-core' ).getSwiperState(),
		};
	} );

	const { setSwiper, goNext, goPrev } = useDispatch(
		'quillForms/renderer-core'
	);

	const {
		walkPath,
		welcomeScreens,
		thankyouScreens,
		currentBlockId,
		nextBlockId,
		prevBlockId,
		lastActiveBlockId,
		canGoNext,
		canGoPrev,
		isAnimating,
		isSubmissionScreenActive,
		isWelcomeScreenActive,
		isThankyouScreenActive,
	} = swiper;

	const isFirstField =
		walkPath?.length > 0 && walkPath[ 0 ].id === currentBlockId;

	useEffect( () => {
		if ( isAnimating ) {
			const timer = setTimeout( () => {
				setSwiper( {
					isAnimating: false,
				} );
			}, 600 );
			return () => clearTimeout( timer );
		}
	}, [ swiper ] );

	// Mouse Wheel Handler
	const scrollHandler = useCallback( ( e ) => {
		e.stopPropagation();
		if ( swiper.isAnimating ) return;
		const lethargyCheck = lethargy.check( e );
		const now = new Date().getTime();
		if (
			lethargyCheck === false ||
			isAnimating ||
			( lastScrollDate && now - lastScrollDate < 750 )
		)
			return;
		if (
			canGoPrev &&
			lethargyCheck === 1 &&
			e.deltaY < -50 &&
			! isFirstField
		) {
			// Scroll up
			lastScrollDate = new Date().getTime();
			goPrev();
		} else if (
			canGoNext &&
			lethargyCheck === -1 &&
			e.deltaY > 50 &&
			! isSubmissionScreenActive
		) {
			lastScrollDate = new Date().getTime();
			// Scroll down
			goNext();
		}
	} );

	const getFieldsToRender = () => {
		const fields = [];
		const filteredBlocks = walkPath.filter(
			( block ) =>
				block.id === currentBlockId ||
				block.id === nextBlockId ||
				block.id === prevBlockId ||
				block.id === lastActiveBlockId
		);
		filteredBlocks.forEach( ( block ) => {
			if (
				block.type !== 'welcome-screen' ||
				block.type !== 'thankyou-screen'
			) {
				fields.push( block.id );
			}
		} );
		return fields;
	};

	const fieldsToRender = getFieldsToRender();
	const fields = blocks.filter(
		( block ) =>
			block.type !== 'welcome-screen' && block.type !== 'thankyou-screen'
	);
	return (
		<div
			className={ classnames(
				'renderer-core-form-flow',
				css`
					background: ${theme.backgroundColor};
					font-family: ${theme.font};
					position: relative;
					width: 100%;
					height: 100%;
					overflow: hidden;

					textarea,
					input {
						font-family: ${theme.font};
					}
				`
			) }
		>
			{ blocks?.length > 0 && (
				<Fragment>
					{ isWelcomeScreenActive &&
						welcomeScreens?.length > 0 &&
						welcomeScreens.map( ( screen ) => {
							const blockType = blockTypes[ 'welcome-screen' ];
							return (
								<blockType.rendererConfig.output
									next={ goNext }
									isActive={ currentBlockId === screen.id }
									key={ screen.id }
									id={ screen.id }
									title={ screen.title }
									description={ screen.description }
									attributes={ screen.attributes }
									attachment={ screen.attachment }
								/>
							);
						} ) }
					{ ! isThankyouScreenActive &&
						! isWelcomeScreenActive &&
						fields?.length > 0 && (
							<FieldsWrapper
								currentBlockId={ currentBlockId }
								setSwiper={ setSwiper }
								isActive={ true }
								scrollHandler={ scrollHandler }
								applyLogic={ applyLogic }
							>
								{ ( isFocused ) => (
									<>
										{ fields.map( ( field ) => {
											return (
												<FieldRender
													field={ field }
													isAnimating={ isAnimating }
													isFocused={ isFocused }
													shouldBeRendered={ fieldsToRender.includes(
														field.id
													) }
													key={ `field-render-${ field.id }` }
													isActive={
														currentBlockId ===
														field.id
													}
													id={ field.id }
													setCanGoNext={ ( val ) => {
														if (
															lastActiveBlockId ===
															field.id
														)
															return;
														setSwiper( {
															canGoNext: val,
														} );
													} }
													setCanGoPrev={ ( val ) => {
														if (
															walkPath[ 0 ].id ===
															field.id
														)
															return;
														setSwiper( {
															canGoPrev: val,
														} );
													} }
													next={ goNext }
												/>
											);
										} ) }
										<SubmissionScreen
											active={ isSubmissionScreenActive }
										/>
									</>
								) }
							</FieldsWrapper>
						) }
					<>
						{ isThankyouScreenActive && (
							<>
								{ currentBlockId ===
								'default_thankyou_screen' ? (
									<DefaultThankYouScreen
										isActive={ isThankyouScreenActive }
									/>
								) : (
									<>
										{ thankyouScreens?.length > 0 &&
											thankyouScreens.map( ( screen ) => {
												const blockType =
													blockTypes[
														'thankyou-screen'
													];
												return (
													<blockType.rendererConfig.output
														isActive={
															currentBlockId ===
															screen.id
														}
														key={ screen.id }
														id={ screen.id }
														title={ screen.title }
														description={
															screen.description
														}
														attributes={
															screen.attributes
														}
														attachment={
															screen.attachment
														}
													/>
												);
											} ) }
									</>
								) }
							</>
						) }
					</>
				</Fragment>
			) }
			<FormFooter />
		</div>
	);
};
export default FormFlow;
