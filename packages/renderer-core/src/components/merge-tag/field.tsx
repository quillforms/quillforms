/* eslint-disable no-nested-ternary */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import DefaultMergeTag from './default-merge-tag';
interface Props {
	modifier: string;
}
const FieldMergeTag: React.FC< Props > = ( { modifier } ) => {
	const { fieldMergeTagValue } = useSelect( ( select ) => {
		const fieldVal = select( 'quillForms/renderer-core' ).getFieldAnswerVal(
			modifier
		);
		const blockTypes = select( 'quillForms/blocks' ).getBlockTypes();
		const walkPath = select( 'quillForms/renderer-core' ).getWalkPath();
		const block = walkPath.find( ( a ) => a.id === modifier );
		if ( ! block )
			return {
				fieldMergeTagValue: null,
			};
		const blockType = blockTypes[ block.name ];
		return {
			fieldMergeTagValue: blockType ? (
				blockType?.mergeTag && fieldVal ? (
					// @ts-expect-error
					<blockType.mergeTag
						fieldId={ modifier }
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
