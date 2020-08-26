import { useSelect } from '@wordpress/data';

const FieldMention = ( props ) => {
	const { fieldId } = props;

	const { fieldAnswerRowValue } = useSelect( ( select ) => {
		const answer = select( 'quillForms/renderer-submission' )
			.getAnswers()
			.find( ( a ) => a.id === fieldId );
		const fieldVal = answer.value;
		const fieldType = answer.type;
		return {
			fieldAnswerRowValue:
				fieldVal && fieldVal.length !== 0
					? select( 'quillForms/blocks' )
							.getBlocks()
							[ fieldType ].getRawValue( fieldVal )
					: '_ _ _ _ _',
		};
	} );

	return <span className="field__mention">{ fieldAnswerRowValue }</span>;
};

export default FieldMention;
