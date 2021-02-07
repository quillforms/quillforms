/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * External Dependencies
 */
import parse from 'html-react-parser';
import { uniqueId } from 'lodash';

/**
 * Internal Dependencies
 */
import MergeTag from '../merge-tag';

const HtmlParser = ( { value } ) => {
	value = value.replace(
		/{{([a-zA-Z0-9]+):([a-zA-Z0-9-_]+)}}/g,
		( match, p1, p2 ) => {
			return `<mergetag type='${ p1 }' modifier='${ p2 }'></mergetag>`;
		}
	);

	return (
		<Fragment>
			{ parse( value, {
				replace: ( domNode ) => {
					if ( domNode.name === 'mergetag' ) {
						const { modifier, type } = domNode.attribs;
						return (
							<MergeTag
								key={ `merge-tag-${ type }-${ modifier }-${ uniqueId() }` }
								type={ type }
								modifier={ modifier }
							/>
						);
					}
				},
			} ) }
		</Fragment>
	);
};
export default HtmlParser;
