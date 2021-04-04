import { useFieldRenderContext } from '../field-render';

interface Props {
	modifier: string;
}
const AttributeMergeTag: React.FC< Props > = ( { modifier } ) => {
	const { attributes } = useFieldRenderContext();
	let modifierRender: React.ReactNode = <>'_ _ _ _ _'</>;
	if ( attributes && attributes[ modifier ] ) {
		modifierRender = <> { attributes[ modifier ] } </>;
	}
	return (
		<span className="renderer-core-attribute-merge-tag">
			{ modifierRender }
		</span>
	);
};
export default AttributeMergeTag;
