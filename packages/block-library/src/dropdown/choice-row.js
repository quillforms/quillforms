/**
 * QuillForms Dependencies
 */
import { TextControl } from '@quillforms/builder-components';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import OpenWithIcon from '@material-ui/icons/OpenWith';

/**
 * Internal Depenedencies
 */
import { useChoiceContext } from './choices-context';

const ChoiceRow = ( { choices, index, provided } ) => {
	const {
		labelChangeHandler,
		scoreChangeHandler,
		setScore,
		addChoice,
		removeChoice,
	} = useChoiceContext();
	const item = choices[ index ];
	return (
		<div className="qf-block-dropdown__choice-row">
			<div { ...provided.dragHandleProps }>
				<OpenWithIcon />
			</div>
			<TextControl
				className={ css`
					width: ${setScore ? '150px' : '100%'};
				` }
				value={ item.label }
				setValue={ ( val ) => labelChangeHandler( val, index ) }
			/>
			{ setScore && (
				<TextControl
					className={ css`
						margin-left: 6px;
						width: 70px;
					` }
					type={ 'number' }
					value={ item.score }
					setValue={ ( val ) => scoreChangeHandler( val, index ) }
				/>
			) }

			<div className="qf-block-dropdown__choice-actions">
				<div className="qf-block-dropdown__choice-add">
					<AddIcon onClick={ () => addChoice( index + 1 ) } />
				</div>
				{ choices.length > 1 && (
					<div className="qf-block-dropdown__choice-remove">
						<RemoveIcon
							onClick={ () => {
								removeChoice( item.ref );
							} }
						/>
					</div>
				) }
			</div>
		</div>
	);
};

export default ChoiceRow;
