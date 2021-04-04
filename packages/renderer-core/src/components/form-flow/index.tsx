/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { AsyncModeProvider, useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
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

interface Props {
	applyLogic: boolean;
}
const FormFlow: React.FC< Props > = ( { applyLogic } ) => {
	const blockTypes = useBlockTypes();
	const blocks = useBlocks();
	const theme = useTheme();
	const { swiper } = useSelect( ( select ) => {
		return {
			swiper: select( 'quillForms/renderer-core' ).getSwiperState(),
		};
	} );

	const { goNext } = useDispatch( 'quillForms/renderer-core' );

	console.log( swiper );
	const {
		walkPath,
		welcomeScreens,
		thankyouScreens,
		currentBlockId,
		nextBlockId,
		prevBlockId,
		lastActiveBlockId,
		isSubmissionScreenActive,
		isWelcomeScreenActive,
		isThankyouScreenActive,
	} = swiper;

	const getFieldsToRender = (): string[] => {
		const fieldIds: string[] = [];
		const filteredBlocks = walkPath.filter(
			( block ) =>
				block.id === currentBlockId ||
				block.id === nextBlockId ||
				block.id === prevBlockId ||
				block.id === lastActiveBlockId
		);
		filteredBlocks.forEach( ( block ) => {
			if (
				block.name !== 'welcome-screen' &&
				block.name !== 'thankyou-screen'
			) {
				fieldIds.push( block.id );
			}
		} );
		return fieldIds;
	};

	const fieldsToRender = getFieldsToRender();
	const fields = blocks.filter(
		( block ) =>
			block.name !== 'welcome-screen' && block.name !== 'thankyou-screen'
	);
	return (
		<AsyncModeProvider value={ false }>
			<div
				className={ classnames(
					'renderer-core-form-flow',
					css`
						background: ${ theme?.backgroundColor };
						font-family: ${ theme?.font };
						position: relative;
						width: 100%;
						height: 100%;
						overflow: hidden;

						textarea,
						input {
							font-family: ${ theme?.font };
						}
					`
				) }
			>
				{ blocks.length > 0 && (
					<Fragment>
						{ isWelcomeScreenActive &&
							welcomeScreens?.length > 0 &&
							welcomeScreens.map( ( screen ) => {
								const blockType =
									blockTypes[ 'welcome-screen' ];
								return (
									<blockType.output
										next={ goNext }
										isActive={
											currentBlockId === screen.id
										}
										key={ screen.id }
										id={ screen.id }
										attributes={ screen.attributes }
									/>
								);
							} ) }
						{ ! isThankyouScreenActive &&
							! isWelcomeScreenActive &&
							fields.length > 0 && (
								<FieldsWrapper applyLogic={ applyLogic }>
									{ ( isFocused: boolean ) => (
										<>
											{ fields.map( ( field ) => {
												const isActive =
													currentBlockId === field.id;
												return (
													<AsyncModeProvider
														key={ `${ field.id }` }
														value={ ! isActive }
													>
														<FieldRender
															id={ field.id }
															isFocused={
																isFocused
															}
															shouldBeRendered={ fieldsToRender.includes(
																field.id
															) }
															isActive={
																isActive
															}
														/>
													</AsyncModeProvider>
												);
											} ) }
											<SubmissionScreen
												active={
													isSubmissionScreenActive
												}
											/>
										</>
									) }
								</FieldsWrapper>
							) }
						<>
							{ isThankyouScreenActive && (
								<>
									{ currentBlockId ===
										'default_thankyou_screen' ||
									! blockTypes[ 'thankyou-screen' ]
										?.output ? (
										<DefaultThankYouScreen
											isActive={ isThankyouScreenActive }
										/>
									) : (
										<>
											{ thankyouScreens?.length > 0 &&
												thankyouScreens.map(
													( screen ) => {
														const blockType =
															blockTypes[
																'thankyou-screen'
															];
														return (
															<blockType.output
																isActive={
																	currentBlockId ===
																	screen.id
																}
																key={
																	screen.id
																}
																id={ screen.id }
																attributes={
																	screen.attributes
																}
															/>
														);
													}
												) }
										</>
									) }
								</>
							) }
						</>
					</Fragment>
				) }
				<FormFooter />
			</div>
		</AsyncModeProvider>
	);
};
export default FormFlow;
