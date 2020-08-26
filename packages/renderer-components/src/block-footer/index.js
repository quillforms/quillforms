/**
 * Internal Dependencies
 */
import EditableBlockFooter from './editable';
import NonEditableBlockFooter from './non-editable';
const BlockFooter = ( { displayOnly, id, isReviewing, next } ) => {
	return (
		<>
			{ displayOnly ? (
				<NonEditableBlockFooter next={ next } />
			) : (
				<EditableBlockFooter
					id={ id }
					isReviewing={ isReviewing }
					next={ next }
				/>
			) }
		</>
	);
};
export default BlockFooter;
