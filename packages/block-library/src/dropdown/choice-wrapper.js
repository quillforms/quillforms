/**
 * QuillForms Dependencies
 */
import { __experimentalDraggable } from '@quillforms/builder-components';
import ChoiceRow from './choice-row';

const ChoiceWrapper = ( { index, style, data } ) => {
	const item = data[ index ];

	// We are rendering an extra item for the placeholder
	if ( item === undefined ) {
		return null;
	}
	return (
		<__experimentalDraggable
			key={ item.ref }
			draggableId={ item.ref }
			index={ index }
		>
			{ ( provided, snapshot ) => (
				<div
					{ ...provided.draggableProps }
					ref={ provided.innerRef }
					isDragging={ snapshot.isDragging }
					style={ {
						margin: 0,
						...provided.draggableProps.style,
						...style,
					} }
				>
					<ChoiceRow
						choices={ data }
						index={ index }
						provided={ provided }
					/>
				</div>
			) }
		</__experimentalDraggable>
	);
};
export default ChoiceWrapper;
