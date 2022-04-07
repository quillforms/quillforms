/**
 * WordPress Dependencies
 */
import { plus, closeSmall, dragHandle } from '@wordpress/icons';
import { Icon } from '@wordpress/components';
import { MediaUpload } from '@wordpress/media-utils';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Depenedencies
 */
import { useChoiceContext } from './choices-context';
import TextControl from '../text-control';
import type { Choices } from '../choices-bulk-btn/types';
import { DraggableProvided } from 'react-beautiful-dnd';
import PictureIcon from './picture-icon';
interface Props {
	choices: Choices;
	index: number;
	provided: DraggableProvided;
}
const ChoiceRow: React.FC< Props > = ( { choices, index, provided } ) => {
	const {
		withAttachment,
		labelChangeHandler,
		addChoice,
		deleteChoice,
		deleteImageHandler,
		handleMediaUpload,
	} = useChoiceContext();
	const item = choices[ index ];
	const { imageUrl } = item;
	return (
		<div className="admin-components-choices-inserter__choice-row">
			<div { ...provided.dragHandleProps }>
				<Icon icon={ dragHandle } />
			</div>
			{ withAttachment && (
				<div
					className={ css`
						position: ABSOLUTE;
						left: 31px;
						z-index: 111111111;
						height: 34px;
						width: 34px;
						padding: 4px;
						display: flex;
						align-items: center;
						justify-content: center;
						border-right: 1px solid #e3e3e3;
					` }
				>
					{ imageUrl ? (
						<div
							className={ css`
								width: 100%;
								height: 100%;
								background-image: url( ${ imageUrl } );
								background-size: cover;
							` }
						>
							<div
								className={ css`
									position: absolute;
									top: -8px;
									right: -8px;
									background: #c34c50;
									width: 15px;
									height: 15px;
									display: flex;
									align-items: center;
									border-radius: 50%;
									cursor: pointer;
								` }
							>
								<Icon
									className={ css`
										fill: #fff;
									` }
									icon={ closeSmall }
									onClick={ () => {
										deleteImageHandler( index );
									} }
								/>
							</div>
						</div>
					) : (
						<MediaUpload
							onSelect={ ( media ) =>
								handleMediaUpload( media, index )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<PictureIcon onClick={ open } />
							) }
						/>
					) }
				</div>
			) }
			<TextControl
				className={ css`
					width: 100%;
					input.components-text-control__input {
						${ withAttachment && `padding-left: 40px !important` }
					}
				` }
				value={ item.label }
				onChange={ ( val ) => labelChangeHandler( val, index ) }
			/>

			<div className="admin-components-choices-inserter__choice-actions">
				<div className="admin-components-choices-inserter__choice-add">
					<Icon
						icon={ plus }
						onClick={ () => addChoice( index + 1 ) }
					/>
				</div>
				{ choices.length > 1 && (
					<div className="admin-components-choices-inserter__choice-remove">
						<Icon
							className={ css`
								fill: #fff;
							` }
							icon={ closeSmall }
							onClick={ () => {
								deleteChoice( item.value );
							} }
						/>
					</div>
				) }
			</div>
		</div>
	);
};

export default ChoiceRow;
