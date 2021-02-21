/**
 * WordPress Dependencies
 */
import { plus, minus, dragHandle } from '@wordpress/icons';
import { Icon } from '@wordpress/components';
/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Depenedencies
 */
import { useChoiceContext } from './choices-context';
import TextControl from '../text-control';

const ChoiceRow = ( { choices, index, provided } ) => {
	const { labelChangeHandler, addChoice, deleteChoice } = useChoiceContext();
	const item = choices[ index ];
	return (
		<div className="admin-components-choices-inserter__choice-row">
			<div { ...provided.dragHandleProps }>
				<Icon icon={ dragHandle } />
			</div>
			<TextControl
				className={ css`
					width: 100%;
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
							icon={ minus }
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
