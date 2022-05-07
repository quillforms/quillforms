/**
 * WordPress Dependencies
 */
import { autop } from '@wordpress/autop';

/**
 * External Dependencies
 */
import parse from 'html-react-parser';

/**
 * Internal Dependencies
 */
import MergeTag from '../merge-tag';

interface Props {
	value: string | undefined;
}
const HtmlParser: React.FC< Props > = ( { value } ) => {
	if ( ! value ) return null;
	value = value.replace(
		/{{([a-zA-Z0-9-_]+):([a-zA-Z0-9-_]+)}}/g,
		( _match, p1, p2 ) => {
			return `<mergetag type='${ p1 }' modifier='${ p2 }'></mergetag>`;
		}
	);

	value = autop( value );
	return (
		<div className="renderer-core-html-parser">
			{ parse( value, {
				replace: ( domNode ): void | JSX.Element => {
					if (
						// @ts-expect-error
						domNode?.name === 'mergetag'
					) {
						// @ts-expect-error
						const { modifier, type } = domNode.attribs;
						return <MergeTag type={ type } modifier={ modifier } />;
					}
				},
			} ) }
		</div>
	);
};
export default HtmlParser;
