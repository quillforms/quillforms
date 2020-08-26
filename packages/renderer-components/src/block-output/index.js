/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import useBlockRenderContext from '../block-render';

const BlockOutput = () => {
	const { id, field } = useBlockRenderContext();
	const { answerValue, isValid, blocks } = useSelect( ( select ) => {
		return {
			answerValue: select(
				'quillForms/renderer-submission'
			).getFieldAnswerVal( id ),
			isValid: select( 'quillForms/renderer-submission' ).isValidField(
				id
			),
			blocks: select( 'quillForms/blocks' ).getBlocks(),
		};
	} );

	const {
		setIsFieldValid,
		setFieldErrMsgKey,
		setIsFieldAnswered,
		setShowFieldErr,
		setFieldAnswer,
	} = useDispatch( 'quillForms/renderer-submission' );

	const block = blocks[ field.type ];

	const props = {
		required: field.required,
		isReviewing,
		isValid,
		answerValue,
		setIsValid: ( val ) => setIsFieldValid( field.id, val ),
		setIsAnswered: ( val ) => setIsFieldAnswered( field.id, val ),
		setErrMsgKey: ( val ) => setFieldErrMsgKey( field.id, val ),
		setShowErr: ( val ) => setShowFieldErr( field.id, val ),
		setVal: ( val ) => setFieldAnswer( field.id, val ),
	};

	return <block.rendererConfig.ouput { ...props } />;
};
export default BlockOutput;
