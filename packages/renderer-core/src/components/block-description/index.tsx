/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { autop } from '@wordpress/autop';

/**
 * Internal Dependencies
 */
import HtmlParser from '../html-parser';
import { useFieldRenderContext } from '../field-render/context';

const BlockDesc: React.FC = () => {
	const { attributes } = useFieldRenderContext();
	if ( ! attributes || ! attributes.description ) return null;

	const { description } = attributes;
	return (
		<Fragment>
			{ description && description !== '' && (
				<div className="renderer-components-block-description">
					<HtmlParser value={ autop( description ) } />
				</div>
			) }
		</Fragment>
	);
};
export default BlockDesc;
