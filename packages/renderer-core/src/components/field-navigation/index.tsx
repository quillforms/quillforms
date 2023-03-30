/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';
import { cloneDeep, map, omit, size } from 'lodash';

/**
 * Internal Dependencies
 */
import { useCurrentTheme, useFormContext, useFormSettings } from '../../hooks';
import DownIcon from './down-icon';
import UpIcon from './up-icon';

const FieldNavigation = ( { shouldFooterBeDisplayed } ) => {
	const {
		goNext,
		goPrev,
		setIsCurrentBlockSafeToSwipe,
		setIsFieldValid,
		setIsFieldPending,
		setFieldValidationErr,
		goToBlock,
	} = useDispatch( 'quillForms/renderer-core' );
	const { beforeGoingNext } = useFormContext();
	const theme = useCurrentTheme();
	const settings = useFormSettings();
	const { currentBlockId, walkPath, blockTypes } = useSelect( ( select ) => {
		return {
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
			walkPath: select( 'quillForms/renderer-core' ).getWalkPath(),
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );
	const currentBlockIndex = walkPath.findIndex(
		( block ) => block.id === currentBlockId
	);

	const currentBlockName = walkPath[ currentBlockIndex ]?.name;

	const currentBlockType = blockTypes?.[ currentBlockName ];

	const { isCurrentBlockValid, answers } = useSelect( ( select ) => {
		return {
			answers: select( 'quillForms/renderer-core' ).getAnswers(),
			isCurrentBlockValid: currentBlockType?.supports?.innerBlocks
				? select( 'quillForms/renderer-core' )?.hasValidFields(
						currentBlockId
				  )
				: currentBlockType?.supports?.editable
				? select( 'quillForms/renderer-core' )?.isValidField(
						currentBlockId
				  )
				: true,
		};
	} );

	const goNextReally = async () => {
		if ( answers[ currentBlockIndex ]?.isPending ) return;
		if ( beforeGoingNext ) {
			await beforeGoingNext( {
				answers,
				currentBlockId,
				setIsFieldValid,
				setFieldValidationErr,
				setIsCurrentBlockSafeToSwipe,
				goToBlock,
				goNext,
				setIsPending: ( val ) =>
					setIsFieldPending( currentBlockId, val ),
			} );
		} else {
			goNext();
		}
	};

	return (
		<div
			className={ classnames( 'renderer-core-field-navigation', {
				hidden: ! shouldFooterBeDisplayed,
			} ) }
		>
			<div
				className={ classnames(
					'renderer-core-field-navigation__up-icon',
					{
						rotate: settings?.animationDirection === 'horizontal',
					},
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
					{
						rotate: settings?.animationDirection === 'horizontal',
					},
					css`
						background: ${ theme.buttonsBgColor };
					`
				) }
				onClick={ () => {
					if (
						walkPath[ walkPath.length - 1 ].id !== currentBlockId
					) {
						if ( isCurrentBlockValid ) {
							goNextReally();
						} else {
							setIsCurrentBlockSafeToSwipe( false );
						}
					}
				} }
			>
				<DownIcon />
			</div>
		</div>
	);
};
export default FieldNavigation;
