import { useFieldRenderContext } from '../field-render';

const AttributeMergeTag = ( { modifier } ) => {
	const { attributes } = useFieldRenderContext();
	return (
		<span className="renderer-core-attribute-merge-tag">
			{ attributes[ modifier ] }
		</span>
	);
};
export default AttributeMergeTag;
