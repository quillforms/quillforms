/* eslint-disable no-nested-ternary */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import DefaultMergeTag from './default-merge-tag';
const FieldMergeTag = ( { modifier } ) => {
	const { fieldMergeTagValue } = useSelect( ( select ) => {
		const fieldVal = select(
			'quillForms/renderer-submission'
		).getFieldAnswerVal( modifier );
		const blockTypes = select( 'quillForms/blocks' ).getBlockTypes();
		const walkPath = select( 'quillForms/renderer-core' ).getWalkPath();
		const block = walkPath.find( ( a ) => a.id === modifier );
		const blockType = blockTypes[ block?.type ];
		return {
			fieldMergeTagValue: blockType ? (
				blockType?.rendererConfig?.mergeTag && fieldVal ? (
					<blockType.rendererConfig.mergeTag
						val={ fieldVal }
						attributes={ block.attributes }
					/>
				) : (
					<DefaultMergeTag val={ fieldVal } />
				)
			) : null,
		};
	} );

	return (
		<span className="renderer-core-field-merge-tag">
			{ fieldMergeTagValue }
		</span>
	);
};

export default FieldMergeTag;
